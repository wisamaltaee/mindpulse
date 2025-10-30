from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import asyncio

from timer import create_timer, start_background, get_timer, cancel_timer


app = FastAPI()


class StartRequest(BaseModel):
        minutes: float


@app.get("/")
def read_root():
        return {"message": "Hello!", "joshua kim and wisam al taie are gooners and made this app": "5"}


@app.post("/start")
async def start_timer_endpoint(req: StartRequest):
        if req.minutes <= 0:
                raise HTTPException(status_code=400, detail="minutes must be > 0")

        timer_id = create_timer(req.minutes)
        # schedule background runner
        start_background(timer_id)

        return {"id": timer_id, "status": "running", "remaining_seconds": int(req.minutes * 60)}


@app.get("/status/{timer_id}")
def status_endpoint(timer_id: str):
        timer = get_timer(timer_id)
        if not timer:
                raise HTTPException(status_code=404, detail="timer not found")
        return timer


@app.post("/cancel/{timer_id}")
def cancel_endpoint(timer_id: str):
        ok = cancel_timer(timer_id)
        if not ok:
                raise HTTPException(status_code=404, detail="timer not found")
        return {"id": timer_id, "status": "cancelled"}


@app.get("/ui", response_class=HTMLResponse)
def ui():
        html = """
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Timer UI</title>
    </head>
    <body>
        <h1>Start a Timer</h1>
        <label>Minutes: <input id="minutes" type="number" value="1" min="0.01" step="0.01"></label>
        <button id="start">Start</button>
        <div id="status"></div>

        <script>
            async function start() {
                const minutes = parseFloat(document.getElementById('minutes').value);
                const res = await fetch('/start', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({minutes})
                });
                const data = await res.json();
                document.getElementById('status').textContent = 'Started: ' + data.id;
                poll(data.id);
            }

            async function poll(id) {
                const el = document.getElementById('status');
                while (true) {
                    const res = await fetch('/status/' + id);
                    const s = await res.json();
                    el.textContent = `Status: ${s.status} — Remaining: ${s.remaining_seconds}s`;
                    if (s.status !== 'running') break;
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            document.getElementById('start').addEventListener('click', start);
        </script>
    </body>
</html>
"""
        return html


if __name__ == "__main__":
        import uvicorn
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)