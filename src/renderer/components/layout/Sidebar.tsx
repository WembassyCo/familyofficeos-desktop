import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { useAuthStore } from '../../stores/authStore'

type ViewType = 'directory' | 'chat' | 'sessions' | 'files' | 'governance' | 'wealth' | 'education' | 'settings'

interface SidebarProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const NAV_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'directory', label: 'Directory', icon: '👥' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'sessions', label: 'Sessions', icon: '🎯' },
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'governance', label: 'Governance', icon: '⚖️' },
  { id: 'wealth', label: 'Wealth', icon: '💰' },
  { id: 'education', label: 'Education', icon: '📚' },
]

const BOTTOM_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { selectedTenant } = useAppStore()
  const { logout } = useAuthStore()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">🦊</span>
          <span className="logo-text">FamilyOfficeOS</span>
        </div>
        {selectedTenant && (
          <div className="tenant-badge">
            <span className="tenant-indicator">●</span>
            <span className="tenant-name-truncate">McIntosh Family</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-label">MAIN</span>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label-text">{item.label}</span>
                  {item.id === 'chat' && <span className="nav-badge">3</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-section nav-bottom">
          <ul className="nav-list">
            {BOTTOM_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <button className="nav-item logout" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label-text">Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
