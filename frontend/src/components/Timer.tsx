import type { Mode } from '../App'
import './Timer.css'

interface Props {
  secondsLeft: number
  totalSeconds: number
  mode: Mode
}

export default function Timer({ secondsLeft, totalSeconds, mode }: Props) {
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const color = mode === 'work' ? '#e94560' : mode === 'short_break' ? '#4ecdc4' : '#45b7d1'

  return (
    <div className="timer-wrapper">
      <svg viewBox="0 0 220 220" className="timer-svg">
        <circle cx="110" cy="110" r={radius} stroke="#333" strokeWidth="10" fill="none" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />
      </svg>
      <div className="timer-display">
        {mins}:{secs}
      </div>
    </div>
  )
}
