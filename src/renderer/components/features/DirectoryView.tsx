import React, { useState, useEffect } from 'react'
import { ContactList } from './ContactList'
import { ContactDetail } from './ContactDetail'
import { OrganizationList } from './OrganizationList'
import { useContactStore } from '../../stores/contactStore'
import { Users, Building2, ArrowLeft } from 'lucide-react'

type DirectoryTab = 'contacts' | 'organizations'

export const DirectoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('contacts')
  const { selectedContact, selectedOrganization, selectContact, selectOrganization } = useContactStore()

  // Clear selections when switching tabs
  useEffect(() => {
    selectContact(null)
    selectOrganization(null)
  }, [activeTab, selectContact, selectOrganization])

  const isDetailView = activeTab === 'contacts' && selectedContact || 
                       activeTab === 'organizations' && selectedOrganization

  return (
    <div className="fox-directory-view">
      {/* Tab Navigation */}
      <div className="fox-directory-tabs">
        <button
          className={`fox-tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <Users size={18} />
          Contacts
        </button>
        <button
          className={`fox-tab ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('organizations')}
        >
          <Building2 size={18} />
          Organizations
        </button>
      </div>

      {/* Content */}
      <div className="fox-directory-content">
        {isDetailView ? (
          <>
            <button 
              className="fox-back-btn"
              onClick={() => {
                if (activeTab === 'contacts') {
                  selectContact(null)
                } else {
                  selectOrganization(null)
                }
              }}
            >
              <ArrowLeft size={16} />
              Back to list
            </button>
            {activeTab === 'contacts' && selectedContact ? (
              <ContactDetail />
            ) : activeTab === 'organizations' && selectedOrganization ? (
              <OrganizationDetail />
            ) : null}
          </>
        ) : (
          <>
            {activeTab === 'contacts' ? (
              <ContactList />
            ) : (
              <OrganizationList />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Simple Organization Detail placeholder
const OrganizationDetail: React.FC = () => {
  const { selectedOrganization, selectOrganization } = useContactStore()
  
  if (!selectedOrganization) return null
  
  return (
    <div className="fox-contact-detail">
      <div className="fox-detail-header">
        <button 
          className="fox-btn fox-btn-ghost"
          onClick={() => selectOrganization(null)}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
      
      <div className="fox-detail-content">
        <div className="fox-profile-header">
          <div className="fox-avatar fox-avatar-lg">
            {selectedOrganization.name.charAt(0)}
          </div>
          <div className="fox-profile-info">
            <h1>{selectedOrganization.name}</h1>
            <span className={`fox-badge fox-badge-${selectedOrganization.status === 'active' ? 'success' : 'error'}`}>
              {selectedOrganization.status}
            </span>
          </div>
        </div>
        
        <div className="fox-detail-grid">
          <div className="fox-detail-item">
            <label>Industry</label>
            <span>{selectedOrganization.industry || 'Not specified'}</span>
          </div>
          <div className="fox-detail-item">
            <label>Website</label>
            <span>{selectedOrganization.website || 'Not provided'}</span>
          </div>
          <div className="fox-detail-item">
            <label>Email</label>
            <span>{selectedOrganization.email || 'Not provided'}</span>
          </div>
          <div className="fox-detail-item">
            <label>Phone</label>
            <span>{selectedOrganization.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}