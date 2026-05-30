import { useState, useEffect, useRef } from 'react'
import Timer from './components/Timer'
import Controls from './components/Controls'
import Settings from './components/Settings'
import Stats from './components/Stats'
import './App.css'

export type Mode = 'work' | 'short_break' | 'long_break'

export interface Config {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  pomosBeforeLongBreak: number
}

const DEFAULT_CONFIG: Config = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  pomosBeforeLongBreak: 4,
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function App() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
  const [mode, setMode] = useState<Mode>('work')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CONFIG.workMinutes * 60)
  const [running, setRunning] = useState(false)
  const [pomosThisSession, setPomosThisSession] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalSeconds = (m: Mode, cfg: Config) => {
    if (m === 'work') return cfg.workMinutes * 60
    if (m === 'short_break') return cfg.shortBreakMinutes * 60
    return cfg.longBreakMinutes * 60
  }

  // Reset timer when mode or config changes (and not running)
  useEffect(() => {
    setSecondsLeft(totalSeconds(mode, config))
    setRunning(false)
  }, [mode, config])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            handleSessionEnd()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const handleSessionEnd = () => {
    setRunning(false)
    notify()
    playSound()
    if (mode === 'work') {
      const newCount = pomosThisSession + 1
      setPomosThisSession(newCount)
      recordSession()
      if (newCount % config.pomosBeforeLongBreak === 0) {
        setMode('long_break')
      } else {
        setMode('short_break')
      }
    } else {
      setMode('work')
    }
  }

  const recordSession = async () => {
    try {
      await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_minutes: config.workMinutes }),
      })
    } catch (_) {
      // backend optional
    }
  }

  const notify = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro', {
        body: mode === 'work' ? 'Work session done! Time for a break.' : 'Break over! Back to work.',
        icon: '/tomato.png',
      })
    }
  }

  const playSound = () => {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  }

  const handleStart = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setRunning(true)
  }

  const handlePause = () => setRunning(false)

  const handleReset = () => {
    setRunning(false)
    setSecondsLeft(totalSeconds(mode, config))
  }

  return (
    <div className="app">
      <h1>🍅 Pomodoro</h1>
      <div className="mode-tabs">
        {(['work', 'short_break', 'long_break'] as Mode[]).map((m) => (
          <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
            {m === 'work' ? 'Work' : m === 'short_break' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>
      <Timer secondsLeft={secondsLeft} totalSeconds={totalSeconds(mode, config)} mode={mode} />
      <div className="session-count">Session #{pomosThisSession + 1}</div>
      <Controls
        running={running}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />
      <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
        ⚙ Settings
      </button>
      {showSettings && (
        <Settings config={config} onChange={setConfig} onClose={() => setShowSettings(false)} />
      )}
      <Stats apiBase={API_BASE} pomosThisSession={pomosThisSession} />
    </div>
  )
}

export default App
