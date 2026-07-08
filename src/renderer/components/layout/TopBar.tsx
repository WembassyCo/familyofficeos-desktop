import React from 'react'
import { useAuthStore } from '../../stores/authStore'

export const TopBar: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search anything..."
          />
        </div>
      </div>

      <div className="top-bar-right">
        <button className="btn-icon">🔔</button>
        <button className="btn-icon">⚙️</button>
        <div className="user-avatar" title={user?.name || 'User'}>
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  )
}
