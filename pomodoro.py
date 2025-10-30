import time


def countdown(total_seconds: int, label: str = "Time") -> None:
    try:
        while total_seconds:
            minutes, seconds = divmod(total_seconds, 60)
            print(f"{label} — {minutes:02d}:{seconds:02d}", end="\r")
            time.sleep(1)
            total_seconds -= 1
        print(f"{label} — 00:00")
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
        raise


def run_pomodoro(work_minutes: int, cycles: int = 4, short_break: int = 5, long_break: int = 15) -> None:
    for i in range(1, cycles + 1):
        print(f"\nCycle {i}/{cycles} — Work for {work_minutes} minute(s)")
        countdown(work_minutes * 60, "Work")

        if i < cycles:
            print(f"Short break — {short_break} minute(s)")
            countdown(short_break * 60, "Break")
        else:
            print(f"Long break — {long_break} minute(s)")
            countdown(long_break * 60, "Long Break")

    print("\nAll cycles complete. Nice work!")


def main() -> None:
    try:
        raw = input("Enter work session length in minutes (e.g. 25): ").strip()
        work_minutes = int(float(raw))
        if work_minutes <= 0:
            print("Please enter a positive number of minutes.")
            return

        raw_cycles = input("Enter number of cycles (default 4): ").strip()
        cycles = int(raw_cycles) if raw_cycles else 4
        if cycles <= 0:
            print("Number of cycles must be >= 1")
            return

        print(f"Starting Pomodoro: {work_minutes} minute(s) work, {cycles} cycle(s).")
        run_pomodoro(work_minutes, cycles)

    except KeyboardInterrupt:
        print("\nExiting (keyboard interrupt).")
    except ValueError:
        print("Invalid input — please enter numeric values like 25 or 0.5.")
    except Exception as e:
        print("An error occurred:", e)


if __name__ == "__main__":
    main()
