from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
from datetime import date

app = FastAPI(title="Pomodoro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.environ.get("DB_PATH", "./pomodoro.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            completed_at TEXT NOT NULL DEFAULT (date('now')),
            duration_minutes INTEGER NOT NULL DEFAULT 25
        )"""
    )
    conn.commit()
    conn.close()


init_db()


class SessionCreate(BaseModel):
    duration_minutes: int = 25


@app.post("/sessions", status_code=201)
def record_session(body: SessionCreate):
    conn = get_db()
    conn.execute(
        "INSERT INTO sessions (completed_at, duration_minutes) VALUES (date('now'), ?)",
        (body.duration_minutes,),
    )
    conn.commit()
    conn.close()
    return {"status": "recorded"}


@app.get("/stats")
def get_stats():
    conn = get_db()
    today = str(date.today())
    today_count = conn.execute(
        "SELECT COUNT(*) FROM sessions WHERE completed_at = ?", (today,)
    ).fetchone()[0]
    total_count = conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]
    conn.close()
    return {"today": today_count, "total": total_count}
