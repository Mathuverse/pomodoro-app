import { useEffect, useState } from 'react'
import './Stats.css'

interface Props {
  apiBase: string
  pomosThisSession: number
}

interface StatsData {
  today: number
  total: number
}

export default function Stats({ apiBase, pomosThisSession }: Props) {
  const [stats, setStats] = useState<StatsData | null>(null)

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiBase}/stats`)
      if (res.ok) setStats(await res.json())
    } catch (_) {}
  }

  useEffect(() => {
    fetchStats()
  }, [pomosThisSession])

  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-val">{pomosThisSession}</span>
        <span className="stat-label">This Session</span>
      </div>
      {stats && (
        <>
          <div className="stat">
            <span className="stat-val">{stats.today}</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat">
            <span className="stat-val">{stats.total}</span>
            <span className="stat-label">All Time</span>
          </div>
        </>
      )}
    </div>
  )
}
