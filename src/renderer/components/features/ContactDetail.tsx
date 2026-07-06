import React, { useState } from 'react'
import { useContactStore } from '../../stores/contactStore'
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  Tag,
  Calendar,
  MoreVertical,
  Save,
  X
} from 'lucide-react'

export const ContactDetail: React.FC = () => {
  const { 
    selectedContact, 
    organizations,
    selectContact,
    updateContact,
    deleteContact,
    isSaving,
  } = useContactStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState(selectedContact || {})

  if (!selectedContact) {
    return (
      <div className="fox-empty">
        <div className="fox-empty-icon">👤</div>
        <div className="fox-empty-title">Select a contact</div>
        <div className="fox-empty-description">
          Click on a contact from the list to view details
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    const success = await updateContact(selectedContact.id, formData)
    if (success) {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    const success = await deleteContact(selectedContact.id)
    if (success) {
      selectContact(null)
      setShowDeleteConfirm(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fox-contact-detail">
      {/* Header */}
      <div className="fox-detail-header">
        <button 
          className="fox-btn fox-btn-ghost"
          onClick={() => selectContact(null)}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="fox-detail-actions">
          {!isEditing ? (
            <>
              <button 
                className="fox-btn fox-btn-secondary"
                onClick={() => {
                  setFormData(selectedContact)
                  setIsEditing(true)
                }}
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button 
                className="fox-btn fox-btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          ) : (
            <>
              <button 
                className="fox-btn fox-btn-secondary"
                onClick={() => {
                  setIsEditing(false)
                  setFormData(selectedContact)
                }}
                disabled={isSaving}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className="fox-btn fox-btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><span className="fox-loading-spinner-sm" /> Saving...</>
                ) : (
                  <><Save size={16} /> Save</>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="fox-detail-content">
        {/* Profile Header */}
        <div className="fox-profile-header">
          <div className="fox-avatar fox-avatar-lg">
            {selectedContact.firstName[0]}{selectedContact.lastName[0]}
          </div>
          
          <div className="fox-profile-info">
            {!isEditing ? (
              <>
                <h1>{selectedContact.firstName} {selectedContact.lastName}</h1>
                <div className="fox-profile-meta">
                  <span className={`fox-badge fox-badge-${selectedContact.status === 'active' ? 'success' : 'error'}`}>
                    {selectedContact.status}
                  </span>
                  {selectedContact.tags?.map(tag => (
                    <span key={tag} className="fox-tag">{tag}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="fox-edit-name">
                <input
                  type="text"
                  className="fox-input"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="fox-input"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last Name"
                />
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="fox-detail-grid">
          {/* Email */}
          <div className="fox-detail-item">
            <label><Mail size={14} /> Email</label>
            {!isEditing ? (
              <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
            ) : (
              <input
                type="email"
                className="fox-input"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            )}
          </div>

          {/* Phone */}
          <div className="fox-detail-item">
            <label><Phone size={14} /> Phone</label>
            {!isEditing ? (
              selectedContact.phone ? (
                <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
              ) : (
                <span className="fox-muted">Not provided</span>
              )
            ) : (
              <input
                type="tel"
                className="fox-input"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            )}
          </div>

          {/* Organization */}
          <div className="fox-detail-item">
            <label><Building2 size={14} /> Organization</label>
            {!isEditing ? (
              selectedContact.organizationName || (
                <span className="fox-muted">Not associated</span>
              )
            ) : (
              <select
                className="fox-input"
                value={formData.organizationId || ''}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value || undefined })}
              >
                <option value="">Select organization...</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Tags */}
          <div className="fox-detail-item">
            <label><Tag size={14} /> Tags</label>
            {!isEditing ? (
              selectedContact.tags?.length > 0 ? (
                <div className="fox-tags">
                  {selectedContact.tags.map(tag => (
                    <span key={tag} className="fox-tag">{tag}</span>
                  ))}
                </div>
              ) : (
                <span className="fox-muted">No tags</span>
              )
            ) : (
              <input
                type="text"
                className="fox-input"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                placeholder="Comma-separated tags"
              />
            )}
          </div>

          {/* Created */}
          <div className="fox-detail-item">
            <label><Calendar size={14} /> Created</label>
            <span>{formatDate(selectedContact.createdAt)}</span>
          </div>

          {/* Updated */}
          <div className="fox-detail-item">
            <label><Calendar size={14} /> Updated</label>
            <span>{formatDate(selectedContact.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fox-modal-backdrop">
          <div className="fox-modal fox-modal-sm">
            <div className="fox-modal-header">
              <h3>Delete Contact</h3>
            </div>
            <div className="fox-modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>{selectedContact.firstName} {selectedContact.lastName}</strong>?
              </p>
              <p className="fox-muted">This action cannot be undone.</p>
            </div>
            <div className="fox-modal-footer">
              <button 
                className="fox-btn fox-btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="fox-btn fox-btn-danger"
                onClick={handleDelete}
                disabled={isSaving}
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}