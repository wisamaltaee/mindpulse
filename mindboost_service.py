"""
1) Example input:
   (Invoke-WebRequest -Uri "http://127.0.0.1:5000/predict" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"social_media_hours": 2, "texting_hours": 3, "sleep_hours": 7, "stress_level": 5, "personality": "owl"}' |
  ConvertFrom-Json).plan

"""

import os
import json
import argparse
from typing import Dict, Any

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import pickle

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from flask import Flask, request, jsonify


MODEL_DIR = "./saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "mindboost_saved")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
os.makedirs(MODEL_DIR, exist_ok=True)

# Personality animals
PERSONALITY_MAP = {
    "lion": 0,
    "fox": 1,
    "wolf": 2,
    "owl": 3,
    "bear": 4,
    "snake": 5,
    "dolphin": 6
}
PERSONALITY_LIST = list(PERSONALITY_MAP.keys())
NUM_PERSONALITIES = len(PERSONALITY_LIST)

# Plan categories
PLAN_CATEGORIES = [
    "Stress-Relief & Mindfulness",
    "Productivity & Focus",
    "Balanced Lifestyle",
    "Sleep & Recovery"
]
NUM_PLANS = len(PLAN_CATEGORIES)

# ---------------------------
# Synthetic data for demo model training wisam >:(
# ---------------------------
def generate_synthetic_wisam_data(n_samples: int = 3000, seed: int = 42):
    """
    Create synthetic dataset for prototyping.
    Columns:
      - social_media_hours (float, hours/day)
      - texting_hours (float, hours/day)
      - personality (categorical string)
    Target:
      - plan_label (int 0..NUM_PLANS-1)
    """

    rng = np.random.default_rng(seed)
    rows = []

    for i in range(n_samples):
        # sample screen usage
        social = float(np.clip(rng.normal(4.0, 2.0), 0.0, 12.0))   # hours/day
        texting = float(np.clip(rng.normal(2.5, 1.5), 0.0, 10.0))  # hours/day
        personality = PERSONALITY_LIST[int(rng.integers(0, NUM_PERSONALITIES))]
        score = (social * 0.6 + texting * 0.4)
        # personality animal
        if personality == "owl":    # nocturnal -> might need sleep recovery more
            score += 1.5
        if personality == "dolphin":  # playful/athletic -> balanced
            score -= 1.0
        if personality == "lion":  # confident -> productivity
            score -= 0.7
        if personality == "snake":  # sneaky -> stress-like
            score += 0.8

        # map score to label
        if score >= 8.0:
            label = 3  # Sleep & Recovery
        elif score >= 5.0:
            label = 0  # Stress-Relief & Mindfulness
        elif score >= 3.0:
            label = 1  # Productivity & Focus
        else:
            label = 2  # Balanced Lifestyle

        rows.append((social, texting, personality, label))

    df = pd.DataFrame(rows, columns=["social_media_hours", "texting_hours", "personality", "label"])
    return df

# ---------------------------
# Feature builder / scaler
# ---------------------------
def build_features(df: pd.DataFrame, scaler: StandardScaler = None):
    """
    Convert DataFrame with columns social_media_hours, texting_hours, personality -> numeric matrix
    One-hot encode personality and scale numeric features.
    Returns (X, scaler) where scaler is fitted if not provided.
    """
    # numeric features
    numeric = df[["social_media_hours", "texting_hours"]].astype(float).to_numpy()

    # one-hot personality
    p_codes = df["personality"].map(PERSONALITY_MAP).astype(int).to_numpy()
    p_onehot = np.eye(NUM_PERSONALITIES)[p_codes]  # shape (N, NUM_PERSONALITIES)

    X_raw = np.concatenate([numeric, p_onehot], axis=1)  # shape (N, 2+NUM_PERSONALITIES)

    if scaler is None:
        scaler = StandardScaler()
        X = scaler.fit_transform(X_raw)
    else:
        X = scaler.transform(X_raw)

    return X, scaler

# ---------------------------
# Model definition
# ---------------------------
def build_model(input_dim: int):
    """
    Build and compile a Keras model that outputs a softmax over PLAN_CATEGORIES
    """
    inputs = layers.Input(shape=(input_dim,), name="input_features")
    x = layers.Dense(64, activation="relu")(inputs)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(32, activation="relu")(x)
    x = layers.Dense(16, activation="relu")(x)
    outputs = layers.Dense(NUM_PLANS, activation="softmax", name="plan_probs")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="mindboost_planner")
    model.compile(optimizer=keras.optimizers.Adam(1e-3),
                  loss="sparse_categorical_crossentropy",
                  metrics=["sparse_categorical_accuracy"])
    return model

# ---------------------------
# Train & save functions
# ---------------------------
def train_and_save(n_samples: int = 3000, epochs: int = 30, save_path: str = MODEL_PATH):
    print("Generating synthetic data...")
    df = generate_synthetic_wisam_data(n_samples)
    X, scaler = build_features(df, scaler=None)
    y = df["label"].to_numpy().astype(int)

    print("Building model...")
    model = build_model(input_dim=X.shape[1])

    print("Training model...")
    model.fit(X, y, validation_split=0.12, epochs=epochs, batch_size=64, verbose=1)

    print(f"Saving model to {save_path} ...")
    model.save(save_path, include_optimizer=False)
    # save scaler
    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)
    print("Model and scaler saved.")


# ---------------------------
# Load model & scaler
# ---------------------------
def load_model_and_scaler(model_path: str = MODEL_PATH):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}. Train first with --train")
    model = keras.models.load_model(model_path)
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    return model, scaler

# ---------------------------
# Plan mapping (turn predicted probs -> text + structured plan)
# ---------------------------
def map_probs_to_plan(probs: np.ndarray) -> Dict[str, Any]:
    """
    Input: probs (1d array of length NUM_PLANS)
    Returns: plan dict with chosen category, confidence, recommendations and structured fields
    """
    idx = int(np.argmax(probs))
    confidence = float(probs[idx])

    plan_name = PLAN_CATEGORIES[idx]

    # recommendations & structured plan per category
    if plan_name == "Stress-Relief & Mindfulness":
        recs = [
            "Start with 10 minutes daily guided breathing",
            "Take 5-minute mindful breaks every hour",
            "Evening reflection journaling for 5 minutes"
        ]
        structured = {
            "daily_mindfulness_min": 10,
            "micro_breaks_every_min": 60,
            "evening_journal_min": 5
        }
    elif plan_name == "Productivity & Focus":
        recs = [
            "Use Pomodoro cycles: 25min focus / 5min break",
            "Turn off notifications during focus blocks",
            "Plan top-3 tasks each morning"
        ]
        structured = {
            "focus_block_minutes": 25,
            "break_minutes": 5,
            "daily_top_tasks": 3
        }
    elif plan_name == "Balanced Lifestyle":
        recs = [
            "Keep a consistent sleep schedule",
            "30 minutes of moderate exercise 3x per week",
            "Weekly social time with friends/family"
        ]
        structured = {
            "target_sleep_hours": 7.5,
            "exercise_min_per_week": 90,
            "social_meetups_per_week": 1
        }
    else:  # "Sleep & Recovery"
        recs = [
            "Avoid screens 60 minutes before bed",
            "Wind-down routine: light stretching + breathing",
            "Try to get consistent bedtime and wake time"
        ]
        structured = {
            "screen_off_before_sleep_min": 60,
            "wind_down_min": 15,
            "target_sleep_hours": 8.0
        }

    return {
        "plan_name": plan_name,
        "confidence": round(confidence, 3),
        "recommendations": recs,
        "structured": structured
    }

# ---------------------------
# Prediction helper
# ---------------------------
def predict_plan_from_payload(payload: Dict[str, Any], model, scaler) -> Dict[str, Any]:
    """
    payload expected keys:
      - social_media_hours (float)
      - texting_hours (float)
      - personality (string)
    Returns JSON-serializable dict with model outputs and plan.
    """
    # Validate keys
    required = ["social_media_hours", "texting_hours", "personality"]
    for k in required:
        if k not in payload:
            raise ValueError(f"Missing required field: {k}")

    social = float(payload["social_media_hours"])
    texting = float(payload["texting_hours"])
    personality = payload["personality"].lower()
    if personality not in PERSONALITY_MAP:
        raise ValueError(f"Unknown personality '{personality}'. Valid: {PERSONALITY_LIST}")

    # Build feature vector (1 x (2 + NUM_PERSONALITIES))
    numeric = np.array([[social, texting]])
    p_code = PERSONALITY_MAP[personality]
    p_onehot = np.eye(NUM_PERSONALITIES)[p_code].reshape(1, -1)
    X_raw = np.concatenate([numeric, p_onehot], axis=1)

    X_scaled = scaler.transform(X_raw)

    probs = model.predict(X_scaled)[0]  # softmax probabilities
    plan = map_probs_to_plan(probs)

    result = {
        "input": {
            "social_media_hours": social,
            "texting_hours": texting,
            "personality": personality
        },
        "probs": probs.tolist(),
        "plan": plan
    }
    return result

# ---------------------------
# Flask server
# ---------------------------
app = Flask("mindboost_service")
MODEL_GLOBAL = None
SCALER_GLOBAL = None

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def api_predict():
    global MODEL_GLOBAL, SCALER_GLOBAL
    if MODEL_GLOBAL is None or SCALER_GLOBAL is None:
        try:
            MODEL_GLOBAL, SCALER_GLOBAL = load_model_and_scaler()
        except Exception as e:
            return jsonify({"error": f"Model not loaded: {str(e)}"}), 500

    try:
        payload = request.get_json(force=True)
        result = predict_plan_from_payload(payload, MODEL_GLOBAL, SCALER_GLOBAL)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "internal error: " + str(e)}), 500

# ---------------------------
# CLI
# ---------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Train synthetic model and save")
    parser.add_argument("--serve", action="store_true", help="Run Flask server")
    parser.add_argument("--samples", type=int, default=3000, help="Synthetic training samples")
    parser.add_argument("--epochs", type=int, default=30, help="Training epochs")
    args = parser.parse_args()

    if args.train:
        train_and_save(n_samples=args.samples, epochs=args.epochs)
    elif args.serve:
        # Load model ahead of time (optional)
        global MODEL_GLOBAL, SCALER_GLOBAL
        MODEL_GLOBAL, SCALER_GLOBAL = load_model_and_scaler()
        print("Starting server on http://127.0.0.1:5000")
        app.run(host="0.0.0.0", port=5000)
    else:
        print("Use --train to create model, then --serve to run the API.\nExample:\n  python mindboost_service.py --train\n  python mindboost_service.py --serve")

if __name__ == "__main__":
    main()
