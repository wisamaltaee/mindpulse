# mindboost_service.py
import argparse
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from flask import Flask, request, jsonify
import os
import pickle

# Define training data generator (temporary synthetic data)
def generate_synthetic_data(n_samples=1000):
    personalities = ['lion', 'fox', 'wolf', 'owl', 'bear', 'snake', 'dolphin']
    X = []
    y = []
    for _ in range(n_samples):
        social_media = np.random.uniform(0, 10)
        texting = np.random.uniform(0, 10)
        personality = np.random.choice(personalities)
        X.append([social_media, texting, personalities.index(personality)])
        y.append(np.random.randint(0, 4))  # Random plan class (0–3)
    return np.array(X), np.array(y)

# Build TensorFlow model
def build_model(input_dim):
    model = keras.Sequential([
        layers.Dense(16, activation='relu', input_shape=(input_dim,)),
        layers.Dense(12, activation='relu'),
        layers.Dense(4, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# Mapping model predictions to plan descriptions
def generate_plan(class_idx):
    plans = [
        {
            "plan_name": "Focus & Discipline",
            "recommendations": ["Limit social media to 2h/day", "Start with 10-min meditation", "Prioritize tasks before relaxation"]
        },
        {
            "plan_name": "Stress Relief",
            "recommendations": ["Try deep breathing", "Walk 20 mins daily", "Sleep 7–8 hours consistently"]
        },
        {
            "plan_name": "Sleep & Recovery",
            "recommendations": ["No screens 1h before bed", "Maintain consistent sleep schedule", "Avoid caffeine late in the day"]
        },
        {
            "plan_name": "Social Growth",
            "recommendations": ["Plan a weekend meetup", "Balance alone time", "Keep social apps purposeful"]
        },
    ]
    return plans[class_idx]

# Flask app
app = Flask(__name__)

MODEL_PATH = "./saved_models/mindboost_saved.keras"
SCALER_PATH = "./saved_models/scaler.pkl"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    try:
        social = float(data['social_media_hours'])
        texting = float(data['texting_hours'])
        personality = data['personality'].lower()
        personalities = ['lion', 'fox', 'wolf', 'owl', 'bear', 'snake', 'dolphin']

        if personality not in personalities:
            return jsonify({"error": "Unknown personality"}), 400

        person_idx = personalities.index(personality)
        input_data = np.array([[social, texting, person_idx]])

        # Load model and scaler
        model = keras.models.load_model(MODEL_PATH)
        with open(SCALER_PATH, 'rb') as f:
            scaler = pickle.load(f)

        scaled = scaler.transform(input_data)
        probs = model.predict(scaled)[0]
        predicted_class = int(np.argmax(probs))

        plan = generate_plan(predicted_class)
        plan["confidence"] = float(np.max(probs))

        return jsonify({
            "input": data,
            "probs": probs.tolist(),
            "plan": plan
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def train_model():
    from sklearn.preprocessing import StandardScaler
    os.makedirs("./saved_models", exist_ok=True)

    X, y = generate_synthetic_data(3000)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = build_model(X_scaled.shape[1])
    model.fit(X_scaled, y, epochs=20, batch_size=32, verbose=1)

    model.save(MODEL_PATH)
    with open(SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)

    print("✅ Model trained and saved successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true")
    parser.add_argument("--serve", action="store_true")
    args = parser.parse_args()

    if args.train:
        train_model()
    elif args.serve:
        print("🚀 Starting server on http://127.0.0.1:5000")
        app.run(host="0.0.0.0", port=5000)
    else:
        print("Please use --train to train the model or --serve to start the server.")
