import React, { useState } from 'react'

export const GovernanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'meetings' | 'voting'>('decisions')

  const decisions = [
    { id: '1', title: 'Approve Q1 Investment Strategy', status: 'pending', date: '2024-01-10', proposer: 'Board Chair' },
    { id: '2', title: 'Family Constitution Amendment', status: 'approved', date: '2024-01-05', proposer: 'Family Council' },
    { id: '3', title: 'New Family Member Onboarding', status: 'rejected', date: '2024-01-03', proposer: 'Governance Committee' },
  ]

  return (
    <div className="view governance-view">
      <div className="view-header">
        <h1>Governance</h1>
        <p>Family governance, decisions, and voting</p>
      </div>

      <div className="view-toolbar">
        <div className="view-tabs">
          <button className={activeTab === 'decisions' ? 'active' : ''} onClick={() => setActiveTab('decisions')}>Decisions</button>
          <button className={activeTab === 'meetings' ? 'active' : ''} onClick={() => setActiveTab('meetings')}>Meetings</button>
          <button className={activeTab === 'voting' ? 'active' : ''} onClick={() => setActiveTab('voting')}>Voting</button>
        </div>
        <button className="btn-primary">
          <span>⚖️</span> New Decision
        </button>
      </div>

      <div className="view-content">
        {activeTab === 'decisions' && (
          <div className="decisions-list">
            {decisions.map((decision) => (
              <div key={decision.id} className={`decision-card ${decision.status}`}>
                <div className="decision-status-icon">
                  {decision.status === 'approved' ? '✅' : decision.status === 'rejected' ? '❌' : '⏳'}
                </div>
                <div className="decision-info">
                  <h4>{decision.title}</h4>
                  <div className="decision-meta">
                    <span>Proposed by {decision.proposer}</span>
                    <span>•</span>
                    <span>{decision.date}</span>
                    <span className={`status-badge ${decision.status}`}>{decision.status}</span>
                  </div>
                </div>
                <div className="decision-actions">
                  <button className="btn-secondary">View</button>
                  {decision.status === 'pending' && <button className="btn-primary">Vote</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">📅</div>
            <h3>Governance Meetings</h3>
            <p>Schedule and manage board meetings, family councils, and committee sessions</p>
          </div>
        )}

        {activeTab === 'voting' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">🗳️</div>
            <h3>Voting Center</h3>
            <p>Active polls, voting history, and proposal management</p>
          </div>
        )}
      </div>
    </div>
  )
}
