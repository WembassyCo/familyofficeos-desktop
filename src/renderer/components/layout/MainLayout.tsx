import React from 'react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { useAppStore } from '../../stores/appStore'
import { DirectoryView } from '../features/DirectoryView'

export const MainLayout: React.FC = () => {
  const { sidebarMode } = useAppStore()

  const renderContent = () => {
    switch (sidebarMode) {
      case 'directory':
        return <DirectoryView />
      case 'governance':
        return <GovernancePlaceholder />
      case 'wealth':
        return <WealthPlaceholder />
      case 'education':
        return <EducationPlaceholder />
      default:
        return <WelcomeView />
    }
  }

  return (
    <div className="fox-app">
      <TopBar />
      <div className="fox-layout">
        <Sidebar />
        <main className="fox-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

const WelcomeView: React.FC = () => (
  <div className="fox-empty">
    <div className="fox-empty-icon">🦊</div>
    <div className="fox-empty-title">Welcome to FamilyOfficeOS</div>
    <div className="fox-empty-description">
      Select a module from the sidebar to get started.
    </div>
  </div>
)

const GovernancePlaceholder: React.FC = () => (
  <div className="fox-empty">
    <div className="fox-empty-icon">⚖️</div>
    <div className="fox-empty-title">Governance</div>
    <div className="fox-empty-description">
      Decision voting and meetings coming in Phase 3.
    </div>
  </div>
)

const WealthPlaceholder: React.FC = () => (
  <div className="fox-empty">
    <div className="fox-empty-icon">📈</div>
    <div className="fox-empty-title">Wealth Intelligence</div>
    <div className="fox-empty-description">
      Portfolio aggregation and analytics coming in Phase 4.
    </div>
  </div>
)

const EducationPlaceholder: React.FC = () => (
  <div className="fox-empty">
    <div className="fox-empty-icon">🎓</div>
    <div className="fox-empty-title">Family Education</div>
    <div className="fox-empty-description">
      AI-powered courses and skills tracking coming in Phase 5.
    </div>
  </div>
)
