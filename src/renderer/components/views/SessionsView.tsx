import React, { useState } from 'react'

export const SessionsView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const sessions = [
    { id: '1', title: 'Family Board Meeting', date: '2024-01-15', time: '14:00', status: 'scheduled', attendees: 8 },
    { id: '2', title: 'Investment Strategy Review', date: '2024-01-14', time: '10:00', status: 'completed', attendees: 5 },
    { id: '3', title: 'Next Generation Workshop', date: '2024-01-20', time: '09:00', status: 'scheduled', attendees: 12 },
  ]

  return (
    <div className="view sessions-view">
      <div className="view-header">
        <h1>Sessions</h1>
        <p>Manage meetings, workshops, and family sessions</p>
      </div>

      <div className="view-toolbar">
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Scheduled</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Past</button>
        </div>
        <button className="btn-primary">
          <span>📅</span> New Session
        </button>
      </div>

      <div className="view-content">
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className={`session-card ${session.status}`}>
              <div className="session-date">
                <span className="month">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="day">{new Date(session.date).getDate()}</span>
              </div>
              <div className="session-info">
                <h4>{session.title}</h4>
                <div className="session-meta">
                  <span>🕒 {session.time}</span>
                  <span>👥 {session.attendees} attendees</span>
                  <span className={`status-badge ${session.status}`}>{session.status}</span>
                </div>
              </div>
              <div className="session-actions">
                <button className="btn-icon">✏️</button>
                <button className="btn-icon">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
