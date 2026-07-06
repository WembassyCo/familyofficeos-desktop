import React, { useEffect, useState } from 'react'
import { useContactStore } from '../../stores/contactStore'
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  User, 
  Building2,
  Mail,
  Phone,
  Check,
  X
} from 'lucide-react'

export const ContactList: React.FC = () => {
  const {
    contacts,
    organizations,
    isLoadingContacts,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    totalCount,
    fetchContacts,
    fetchOrganizations,
    selectContact,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
  } = useContactStore()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchContacts()
    fetchOrganizations()
  }, [fetchContacts, fetchOrganizations])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    fetchContacts(1)
  }

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status)
    fetchContacts(1)
  }

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(contacts.map(c => c.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="fox-contact-list">
      {/* Header */}
      <div className="fox-panel-header">
        <div className="fox-header-left">
          <h2>Contacts</h2>
          <span className="fox-count">{totalCount} total</span>
        </div>
        <div className="fox-header-actions">
          <button 
            className="fox-btn fox-btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filter
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <Search size={16} className="fox-search-icon" />
          <input
            type="text"
            className="fox-input fox-search-input"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {showFilters && (
          <div className="fox-filters">
            <select 
              className="fox-input fox-filter-select"
              value={statusFilter || ''}
              onChange={(e) => handleStatusFilter(e.target.value || null)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            {(searchQuery || statusFilter) && (
              <button 
                className="fox-btn fox-btn-ghost fox-btn-sm"
                onClick={clearFilters}
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="fox-bulk-actions">
          <span>{selectedIds.size} selected</span>
          <button className="fox-btn fox-btn-ghost fox-btn-sm">Export</button>
          <button className="fox-btn fox-btn-ghost fox-btn-sm">Tag</button>
          <button className="fox-btn fox-btn-danger fox-btn-sm">Delete</button>
        </div>
      )}

      {/* Table */}
      <div className="fox-table-wrapper">
        <table className="fox-table fox-contact-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.size === contacts.length && contacts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>Organization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoadingContacts ? (
              <tr>
                <td colSpan={8} className="fox-loading-cell">
                  <div className="fox-loading-spinner-sm" />
                  Loading contacts...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={8} className="fox-empty-cell">
                  <div className="fox-empty">
                    <User size={48} className="fox-empty-icon" />
                    <div className="fox-empty-title">No contacts found</div>
                    <div className="fox-empty-description">
                      {searchQuery 
                        ? 'Try adjusting your search or filters'
                        : 'Add your first contact to get started'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr 
                  key={contact.id}
                  className={selectedIds.has(contact.id) ? 'selected' : ''}
                  onClick={() => selectContact(contact)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(contact.id)}
                      onChange={(e) => handleSelect(contact.id, e.target.checked)}
                    />
                  </td>
                  <td>
                    <div className="fox-contact-name">
                      <div className="fox-avatar fox-avatar-sm">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <span>{contact.firstName} {contact.lastName}</span>
                    </div>
                  </td>
                  <td>
                    {contact.organizationName ? (
                      <div className="fox-org-cell">
                        <Building2 size={14} />
                        {contact.organizationName}
                      </div>
                    ) : (
                      <span className="fox-muted">—</span>
                    )}
                  </td>
                  <td>
                    <a href={`mailto:${contact.email}`} className="fox-email-link">
                      <Mail size={14} />
                      {contact.email}
                    </a>
                  </td>
                  <td>
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="fox-phone-link">
                        <Phone size={14} />
                        {contact.phone}
                      </a>
                    ) : (
                      <span className="fox-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`fox-badge fox-badge-${contact.status === 'active' ? 'success' : 'error'}`}>
                      {contact.status === 'active' ? (
                        <><Check size={12} /> Active</>
                      ) : (
                        <><X size={12} /> Inactive</>
                      )}
                    </span>
                  </td>
                  <td className="fox-muted">{formatDate(contact.createdAt)}</td>
                  <td>
                    <button className="fox-btn fox-btn-ghost fox-btn-icon">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fox-pagination">
          <button 
            className="fox-btn fox-btn-secondary fox-btn-sm"
            disabled={currentPage === 1}
            onClick={() => fetchContacts(currentPage - 1)}
          >
            Previous
          </button>
          <span className="fox-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="fox-btn fox-btn-secondary fox-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => fetchContacts(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}