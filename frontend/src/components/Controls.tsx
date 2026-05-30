import './Controls.css'

interface Props {
  running: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function Controls({ running, onStart, onPause, onReset }: Props) {
  return (
    <div className="controls">
      {running ? (
        <button className="btn btn-pause" onClick={onPause}>Pause</button>
      ) : (
        <button className="btn btn-start" onClick={onStart}>Start</button>
      )}
      <button className="btn btn-reset" onClick={onReset}>Reset</button>
    </div>
  )
}
