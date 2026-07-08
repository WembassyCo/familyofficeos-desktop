import React, { useState } from 'react'

export const WealthView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'accounts' | 'analytics'>('portfolio')

  const portfolioSummary = {
    totalValue: '$42,847,293',
    dayChange: '+$127,493 (+0.30%)',
    ytdReturn: '+8.4%',
    allocation: [
      { name: 'Public Equity', value: '45%', color: '#0ea5e9' },
      { name: 'Private Equity', value: '25%', color: '#8b5cf6' },
      { name: 'Real Estate', value: '15%', color: '#f59e0b' },
      { name: 'Fixed Income', value: '10%', color: '#10b981' },
      { name: 'Cash', value: '5%', color: '#64748b' },
    ]
  }

  return (
    <div className="view wealth-view">
      <div className="view-header">
        <h1>Wealth Intelligence</h1>
        <p>Portfolio management and wealth analytics</p>
      </div>

      <div className="view-toolbar">
        <div className="view-tabs">
          <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
          <button className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}>Accounts</button>
          <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>Analytics</button>
        </div>
        <button className="btn-primary">
          <span>💳</span> Connect Account
        </button>
      </div>

      <div className="view-content">
        {activeTab === 'portfolio' && (
          <>
            <div className="wealth-summary">
              <div className="summary-card total">
                <span className="label">Total Portfolio Value</span>
                <span className="value">{portfolioSummary.totalValue}</span>
                <span className="change positive">{portfolioSummary.dayChange}</span>
              </div>
              <div className="summary-card">
                <span className="label">YTD Return</span>
                <span className="value positive">{portfolioSummary.ytdReturn}</span>
              </div>
              <div className="summary-card">
                <span className="label">Active Positions</span>
                <span className="value">47</span>
              </div>
            </div>

            <div className="allocation-section">
              <h3>Asset Allocation</h3>
              <div className="allocation-chart">
                {portfolioSummary.allocation.map((asset) => (
                  <div key={asset.name} className="allocation-bar">
                    <div className="allocation-fill" style={{ width: asset.value, backgroundColor: asset.color }} />
                    <span className="allocation-label">{asset.name}</span>
                    <span className="allocation-value">{asset.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'accounts' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">🏦</div>
            <h3>Connected Accounts</h3>
            <p>Manage bank accounts, investment accounts, and custodians</p>
            <ul className="feature-list">
              <li>🔌 Plaid integration for real-time balances</li>
              <li>📊 Multi-custodian aggregation</li>
              <li>📈 Performance tracking across accounts</li>
            </ul>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">📈</div>
            <h3>Wealth Analytics</h3>
            <p>Advanced analytics, reporting, and forecasting</p>
          </div>
        )}
      </div>
    </div>
  )
}
