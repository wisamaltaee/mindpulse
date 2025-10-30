import asyncio
import time
import uuid
from typing import Optional

timers = {}


async def _runner(timer_id: str) -> None:
    """Background coroutine that updates timer state until finished or cancelled."""
    timer = timers.get(timer_id)
    if not timer:
        return

    duration = timer["duration_seconds"]
    start_at = timer["started_at"]
    end_at = start_at + duration

    while True:
        now = time.time()
        if timer.get("cancelled"):
            timer["status"] = "cancelled"
            break

        remaining = int(max(0, end_at - now))
        timer["remaining_seconds"] = remaining

        if remaining <= 0:
            timer["status"] = "finished"
            timer["finished_at"] = time.time()
            break

        await asyncio.sleep(min(1, remaining))


def create_timer(minutes: float) -> str:
    """Create a timer record and return its id. Does not start the runner.

    Use `start_background` from an async context to begin the background runner.
    """
    timer_id = str(uuid.uuid4())
    duration_seconds = int(max(0, minutes) * 60)
    now = time.time()
    timers[timer_id] = {
        "id": timer_id,
        "status": "created",
        "duration_seconds": duration_seconds,
        "remaining_seconds": duration_seconds,
        "started_at": now,
        "finished_at": None,
        "cancelled": False,
    }
    return timer_id


def get_timer(timer_id: str) -> Optional[dict]:
    timer = timers.get(timer_id)
    if not timer:
        return None

    if timer["status"] in ("running", "created"):
        now = time.time()
        elapsed = int(now - timer["started_at"])
        remaining = max(0, timer["duration_seconds"] - elapsed)
        timer["remaining_seconds"] = remaining
        if remaining == 0:
            timer["status"] = "finished"
            timer["finished_at"] = time.time()

    return dict(timer)


def cancel_timer(timer_id: str) -> bool:
    timer = timers.get(timer_id)
    if not timer:
        return False
    timer["cancelled"] = True
    return True


def start_background(timer_id: str):
    """Schedule the background runner for an existing timer (call from async context)."""
    timer = timers.get(timer_id)
    if not timer:
        return None
    timer["status"] = "running"
    return asyncio.create_task(_runner(timer_id))
