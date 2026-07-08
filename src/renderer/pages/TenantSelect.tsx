import React from 'react'
import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import '../styles/TenantSelect.css'

const MOCK_TENANTS = [
  { id: '1', name: 'McIntosh Family Office', role: 'Administrator', logo: '🏛️' },
  { id: '2', name: 'Wembassy Holdings', role: 'Advisor', logo: '🏢' },
  { id: '3', name: 'Demo Family Office', role: 'Viewer', logo: '🏠' },
]

export const TenantSelect: React.FC = () => {
  const { selectTenant, setShowTenantSelect } = useAppStore()
  const { logout, user } = useAuthStore()

  const handleSelect = (tenantId: string) => {
    selectTenant(tenantId)
    setShowTenantSelect(false)
  }

  return (
    <div className="tenant-select-screen">
      <div className="tenant-select-container">
        <div className="tenant-header">
          <div className="logo-icon">🦊</div>
          <h1>Select Family Office</h1>
          <p>Welcome back, {user?.name || 'User'}</p>
        </div>

        <div className="tenant-list">
          {MOCK_TENANTS.map((tenant) => (
            <button
              key={tenant.id}
              className="tenant-card"
              onClick={() => handleSelect(tenant.id)}
            >
              <div className="tenant-logo">{tenant.logo}</div>
              <div className="tenant-info">
                <span className="tenant-name">{tenant.name}</span>
                <span className="tenant-role">{tenant.role}</span>
              </div>
              <span className="tenant-arrow">→</span>
            </button>
          ))}
        </div>

        <div className="tenant-actions">
          <button className="join-tenant-btn">
            ➕ Join Another Family Office
          </button>

          <button onClick={logout} className="logout-btn">
            🚪 Sign Out
          </button>
        </div>

        <div className="tenant-footer">
          <p>Need help? Contact support@wembassy.com</p>
        </div>
      </div>
    </div>
  )
}
