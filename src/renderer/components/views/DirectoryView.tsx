import React, { useState } from 'react'

export const DirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'contacts' | 'organizations' | 'family-members'>('contacts')

  return (
    <div className="view directory-view">
      <div className="view-header">
        <h1>Directory</h1>
        <p>Manage contacts, organizations, and family members</p>
      </div>

      <div className="view-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-tabs">
          <button
            className={activeTab === 'contacts' ? 'active' : ''}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
          <button
            className={activeTab === 'organizations' ? 'active' : ''}
            onClick={() => setActiveTab('organizations')}
          >
            Organizations
          </button>
          <button
            className={activeTab === 'family-members' ? 'active' : ''}
            onClick={() => setActiveTab('family-members')}
          >
            Family Members
          </button>
        </div>

        <button className="btn-primary">
          <span>➕</span> Add New
        </button>
      </div>

      <div className="view-content">
        <div className="placeholder-content">
          <div className="placeholder-icon">👥</div>
          <h3>Directory</h3>
          <p>This view will display {activeTab} with full CRUD functionality</p>
          <ul className="feature-list">
            <li>📇 Contact cards with rich profiles</li>
            <li>🏢 Organization hierarchies</li>
            <li>👨‍👩‍👧‍👦 Family relationship mapping</li>
            <li>📧 Email integration</li>
            <li>📱 Phone & address management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
