import React, { useState } from 'react'

export const FilesView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [currentFolder, setCurrentFolder] = useState('root')

  const folders = [
    { id: '1', name: 'Financial Documents', files: 45, size: '2.3 GB' },
    { id: '2', name: 'Governance', files: 12, size: '156 MB' },
    { id: '3', name: 'Family Photos', files: 230, size: '4.1 GB' },
  ]

  const recentFiles = [
    { id: '1', name: 'Q4 2024 Portfolio Summary.pdf', size: '2.4 MB', date: 'Jan 8, 2024' },
    { id: '2', name: 'Board Meeting Minutes.docx', size: '156 KB', date: 'Jan 7, 2024' },
    { id: '3', name: 'Family Constitution 2024.pdf', size: '1.8 MB', date: 'Jan 5, 2024' },
  ]

  return (
    <div className="view files-view">
      <div className="view-header">
        <h1>Files</h1>
        <p>Secure document storage and management</p>
      </div>

      <div className="view-toolbar">
        <div className="breadcrumb">
          <span>🏠</span> / <span>Files</span>
          {currentFolder !== 'root' && <span>/ {currentFolder}</span>}
        </div>
        <div className="toolbar-actions">
          <button className="btn-secondary">📁 New Folder</button>
          <button className="btn-primary">📤 Upload</button>
          <div className="view-toggle">
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
          </div>
        </div>
      </div>

      <div className="view-content">
        <div className="files-section">
          <h3>Folders</h3>
          <div className="folders-grid">
            {folders.map((folder) => (
              <div key={folder.id} className="folder-card">
                <div className="folder-icon">📁</div>
                <div className="folder-info">
                  <span className="folder-name">{folder.name}</span>
                  <span className="folder-meta">{folder.files} files • {folder.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="files-section">
          <h3>Recent Files</h3>
          <div className="files-list">
            {recentFiles.map((file) => (
              <div key={file.id} className="file-item">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{file.size}</span>
                <span className="file-date">{file.date}</span>
                <div className="file-actions">
                  <button className="btn-icon">⬇️</button>
                  <button className="btn-icon">🔗</button>
                  <button className="btn-icon">⋯</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
