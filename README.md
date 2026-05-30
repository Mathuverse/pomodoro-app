# Pomodoro App

A full-stack Pomodoro timer with a React/TypeScript frontend and FastAPI + SQLite backend.

## Stack

- **Frontend**: React 18 + TypeScript (Vite)
- **Backend**: FastAPI (Python 3.12) + SQLite
- **Orchestration**: Docker Compose

## Features

- 25 min work / 5 min short break / 15 min long break (standard Pomodoro cycle)
- Visual circular countdown timer
- Start / Pause / Reset controls
- Session counter (pomodoros completed this session)
- Auto-transition between work and break modes (after 4 pomodoros → long break)
- Web Audio API beep + browser notification on session end
- Configurable durations via settings panel
- Persistent stats via FastAPI + SQLite (today's count and all-time total)

## Quick Start

### With Docker Compose (recommended)

```bash
docker compose up --build
```

Then visit http://localhost:5173 for the frontend.  
The backend API runs at http://localhost:8000.

### Frontend (dev mode)

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

### Backend (dev mode)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Reference

### `POST /sessions`

Record a completed pomodoro session.

```json
{ "duration_minutes": 25 }
```

Returns: `{ "status": "recorded" }`

### `GET /stats`

Get session statistics.

Returns: `{ "today": 3, "total": 47 }`

## Project Structure

```
pomodoro-app/
├── frontend/           # React + TypeScript (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Timer.tsx
│   │   │   ├── Controls.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Stats.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── vite.config.ts
├── backend/            # FastAPI + SQLite
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
