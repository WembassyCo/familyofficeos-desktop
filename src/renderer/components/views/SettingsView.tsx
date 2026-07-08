import React, { useState } from 'react'
import { useAppStore } from '../../stores/appStore'
import { useAuthStore } from '../../stores/authStore'

export const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'notifications' | 'security'>('profile')
  const { selectedTenant } = useAppStore()
  const { logout, user } = useAuthStore()

  return (
    <div className="view settings-view">
      <div className="view-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              <span>👤</span> Profile
            </button>
            <button 
              className={activeSection === 'account' ? 'active' : ''}
              onClick={() => setActiveSection('account')}
            >
              <span>⚙️</span> Account
            </button>
            <button 
              className={activeSection === 'notifications' ? 'active' : ''}
              onClick={() => setActiveSection('notifications')}
            >
              <span>🔔</span> Notifications
            </button>
            <button 
              className={activeSection === 'security' ? 'active' : ''}
              onClick={() => setActiveSection('security')}
            >
              <span>🔒</span> Security
            </button>
          </nav>
        </aside>

        <div className="settings-content">
          {activeSection === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              
              <div className="profile-header">
                <div className="avatar-large">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="profile-info">
                  <h4>{user?.name || 'User'}</h4>
                  <p>{user?.email || 'user@example.com'}</p>
                  <p className="role">{user?.role || 'Member'}</p>
                </div>
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user?.name || ''} />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea rows={3} placeholder="Tell us about yourself..." />
              </div>

              <button className="btn-primary">Save Changes</button>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="settings-section">
              <h3>Account Settings</h3>
              
              <div className="info-card">
                <span className="label">Current Family Office</span>
                <span className="value">{selectedTenant || 'Not selected'}</span>
              </div>

              <div className="form-group">
                <label>Email Notifications</label>
                <div className="toggle-list">
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Session reminders</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Chat messages</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" />
                    <span>Weekly digest</span>
                  </label>
                </div>
              </div>

              <button className="btn-primary">Save Preferences</button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <p>Choose how you want to be notified</p>

              <div className="notification-options">
                <div className="notification-item">
                  <div>
                    <h4>Push Notifications</h4>
                    <p>Receive notifications on your desktop</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="notification-item">
                  <div>
                    <h4>Email Notifications</h4>
                    <p>Receive email updates about important activities</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>

                <div className="notification-item">
                  <div>
                    <h4>Sounds</h4>
                    <p>Play sound for new messages</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>

              <button className="btn-primary">Update Password</button>

              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <button className="btn-danger" onClick={logout}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
