import type { Config } from '../App'
import './Settings.css'

interface Props {
  config: Config
  onChange: (c: Config) => void
  onClose: () => void
}

export default function Settings({ config, onChange, onClose }: Props) {
  const update = (key: keyof Config, value: number) =>
    onChange({ ...config, [key]: value })

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        {(
          [
            { key: 'workMinutes', label: 'Work (min)' },
            { key: 'shortBreakMinutes', label: 'Short Break (min)' },
            { key: 'longBreakMinutes', label: 'Long Break (min)' },
            { key: 'pomosBeforeLongBreak', label: 'Pomos before long break' },
          ] as { key: keyof Config; label: string }[]
        ).map(({ key, label }) => (
          <label key={key} className="setting-row">
            <span>{label}</span>
            <input
              type="number"
              min={1}
              max={120}
              value={config[key]}
              onChange={(e) => update(key, Number(e.target.value))}
            />
          </label>
        ))}
        <button className="close-btn" onClick={onClose}>Save &amp; Close</button>
      </div>
    </div>
  )
}
