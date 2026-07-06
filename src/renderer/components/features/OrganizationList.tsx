import React, { useEffect, useState } from 'react'
import { useContactStore } from '../../stores/contactStore'
import { 
  Search, 
  Plus, 
  Filter, 
  Building2,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  Check,
  X,
  ChevronRight
} from 'lucide-react'

export const OrganizationList: React.FC = () => {
  const {
    organizations,
    isLoadingOrganizations,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    totalCount,
    fetchOrganizations,
    selectOrganization,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
  } = useContactStore()

  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    fetchOrganizations(1)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="fox-organization-list">
      {/* Header */}
      <div className="fox-panel-header">
        <div className="fox-header-left">
          <h2>Organizations</h2>
          <span className="fox-count">{totalCount} total</span>
        </div>
        <div className="fox-header-actions">
          <button 
            className="fox-btn fox-btn-ghost"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? 'Grid' : 'List'}
          </button>
          <button 
            className="fox-btn fox-btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filter
          </button>
          <button className="fox-btn fox-btn-primary">
            <Plus size={16} />
            Add Organization
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="fox-list-toolbar">
        <div className="fox-search-wrapper">
          <Search size={16} className="fox-search-icon" />
          <input
            type="text"
            className="fox-input fox-search-input"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {showFilters && (
          <div className="fox-filters">
            <select 
              className="fox-input fox-filter-select"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
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

      {/* Content */}
      {isLoadingOrganizations ? (
        <div className="fox-loading">
          <div className="fox-loading-spinner" />
          <p>Loading organizations...</p>
        </div>
      ) : organizations.length === 0 ? (
        <div className="fox-empty">
          <Building2 size={48} className="fox-empty-icon" />
          <div className="fox-empty-title">No organizations found</div>
          <div className="fox-empty-description">
            Add your first organization to get started
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="fox-org-grid">
          {organizations.map((org) => (
            <div 
              key={org.id}
              className="fox-org-card"
              onClick={() => selectOrganization(org)}
            >
              <div className="fox-org-card-header">
                <div className="fox-avatar fox-avatar-org">
                  {org.name.charAt(0)}
                </div>
                <div className="fox-org-card-info">
                  <h3>{org.name}</h3>
                  <span className="fox-muted">{org.industry || 'No industry'}</span>
                </div>
              </div>
              <div className="fox-org-card-stats">
                <div className="fox-stat">
                  <Users size={14} />
                  <span>{org.contactCount || 0} contacts</span>
                </div>
              </div>
              <div className="fox-org-card-footer">
                <span className={`fox-badge fox-badge-${org.status === 'active' ? 'success' : 'error'}`}>
                  {org.status}
                </span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="fox-table-wrapper">
          <table className="fox-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Industry</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Contacts</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr 
                  key={org.id}
                  onClick={() => selectOrganization(org)}
                >
                  <td>
                    <div className="fox-org-name">
                      <div className="fox-avatar fox-avatar-sm">
                        {org.name.charAt(0)}
                      </div>
                      <span>{org.name}</span>
                    </div>
                  </td>
                  <td>{org.industry || <span className="fox-muted">—</span>}</td>
                  <td>
                    {org.email ? (
                      <a href={`mailto:${org.email}`} className="fox-email-link">
                        <Mail size={14} />
                        {org.email}
                      </a>
                    ) : (
                      <span className="fox-muted">—</span>
                    )}
                  </td>
                  <td>
                    {org.phone ? (
                      <a href={`tel:${org.phone}`} className="fox-phone-link">
                        <Phone size={14} />
                        {org.phone}
                      </a>
                    ) : (
                      <span className="fox-muted">—</span>
                    )}
                  </td>
                  <td>{org.contactCount || 0}</td>
                  <td>
                    <span className={`fox-badge fox-badge-${org.status === 'active' ? 'success' : 'error'}`}>
                      {org.status === 'active' ? <><Check size={12} /> Active</> : <><X size={12} /> Inactive</>}
                    </span>
                  </td>
                  <td className="fox-muted">{formatDate(org.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fox-pagination">
          <button 
            className="fox-btn fox-btn-secondary fox-btn-sm"
            disabled={currentPage === 1}
            onClick={() => fetchOrganizations(currentPage - 1)}
          >
            Previous
          </button>
          <span className="fox-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="fox-btn fox-btn-secondary fox-btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => fetchOrganizations(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}