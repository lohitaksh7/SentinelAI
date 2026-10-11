import { useEffect, useState } from 'react'
import './App.css'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const API = 'http://localhost:8081/api/security/events'

function App() {
  const [events, setEvents] = useState([])
  const [toolName, setToolName] = useState('weather-tool')
  const [userName, setUserName] = useState('demo-user')
  const [action, setAction] = useState('get_weather')
  const [message, setMessage] = useState('Get today weather')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [severityFilter, setSeverityFilter] = useState('ALL')

  async function loadEvents() {
    try {
      const response = await fetch(API)
      if (!response.ok) throw new Error('Could not load events')
      setEvents(await response.json())
      setError('')
    } catch {
      setError('Cannot connect to backend. Make sure Spring Boot is running on port 8081.')
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function submitEvent(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, userName, action, message }),
      })

      if (!response.ok) throw new Error('Request failed')
      await loadEvents()
    } catch {
      setError('Request failed. Check that the Spring Boot backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const blocked = events.filter(event => event.status === 'BLOCKED').length
  const allowed = events.filter(event => event.status === 'ALLOWED').length
  const high = events.filter(event => event.severity === 'HIGH').length
  const chartData = [
  { name: 'Allowed', value: allowed, color: '#4ade80' },
  { name: 'Blocked', value: blocked, color: '#fb7185' },
]

  const filteredEvents = events.filter(event =>
    severityFilter === 'ALL' || event.severity === severityFilter
  )

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">盾</div>
          <div>
            <h1>Sentinel<span>AI</span></h1>
            <p>AI SECURITY THREAT MONITOR</p>
          </div>
        </div>
        <div className="live-status"><span /> SYSTEM MONITORING</div>
      </header>

      <section className="intro">
        <p className="eyebrow">SECURITY OPERATIONS CENTER</p>
        <h2>Threat Monitoring Dashboard</h2>
        <p>Monitor simulated AI tool requests, detect suspicious activity, and track security events in real time.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats">
        <article className="stat-card">
          <p>Total Events</p>
          <strong>{events.length}</strong>
          <span className="stat-note">Recorded requests</span>
        </article>
        <article className="stat-card">
          <p>Threats Blocked</p>
          <strong className="red">{blocked}</strong>
          <span className="stat-note">Blocked requests</span>
        </article>
        <article className="stat-card">
          <p>Requests Allowed</p>
          <strong className="green">{allowed}</strong>
          <span className="stat-note">Permitted requests</span>
        </article>
        <article className="stat-card">
          <p>High Severity</p>
          <strong className="orange">{high}</strong>
          <span className="stat-note">High-risk events</span>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Simulate Tool Request</h3>
            <p>Submit a request to test the security rules.</p>
          </div>
          <span className="demo-tag">DEMO</span>
        </div>

        <form onSubmit={submitEvent} className="event-form">
          <label>
            Tool Name
            <input value={toolName} onChange={e => setToolName(e.target.value)} required />
          </label>
          <label>
            User Name
            <input value={userName} onChange={e => setUserName(e.target.value)} required />
          </label>
          <label>
            Action
            <input value={action} onChange={e => setAction(e.target.value)} required />
          </label>
          <label>
            Request Message
            <input value={message} onChange={e => setMessage(e.target.value)} required />
          </label>
          <button disabled={loading} type="submit">
            {loading ? 'Analyzing...' : 'Analyze Request →'}
          </button>
        </form>
        <p className="hint">Try tool name <b>shell-admin</b> or action <b>delete_all</b> to trigger a demo block.</p>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Threat Distribution</h3>
            <p>Breakdown of allowed and blocked requests.</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Security Event Log</h3>
            <p>Requests recorded by the backend security rules.</p>
          </div>
          <button className="refresh-btn" onClick={loadEvents}>↻ Refresh</button>
        </div>

        <div className="filter-row">
          <label htmlFor="severity-filter">Filter severity:</label>
          <select
            id="severity-filter"
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
          >
            <option value="ALL">All severities</option>
            <option value="HIGH">High severity</option>
            <option value="LOW">Low severity</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TOOL</th>
                <th>USER</th>
                <th>ACTION</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>#{event.id}</td>
                  <td className="tool-cell">{event.toolName}</td>
                  <td>{event.userName}</td>
                  <td>{event.action}</td>
                  <td>
                    <span className={`pill ${event.severity === 'HIGH' ? 'pill-high' : 'pill-low'}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${event.status === 'BLOCKED' ? 'pill-blocked' : 'pill-allowed'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>{event.timestamp ? new Date(event.timestamp).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">No events match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>SentinelAI · Educational security monitoring prototype · Rule-based detection, not a production AI detector</footer>
    </main>
  )
}

export default App