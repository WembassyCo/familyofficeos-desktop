import React, { useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { DirectoryView } from '../components/views/DirectoryView'
import { ChatView } from '../components/views/ChatView'
import { SessionsView } from '../components/views/SessionsView'
import { FilesView } from '../components/views/FilesView'
import { GovernanceView } from '../components/views/GovernanceView'
import { WealthView } from '../components/views/WealthView'
import { EducationView } from '../components/views/EducationView'
import { SettingsView } from '../components/views/SettingsView'
import '../styles/MainApp.css'

type ViewType = 'directory' | 'chat' | 'sessions' | 'files' | 'governance' | 'wealth' | 'education' | 'settings'

export const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('directory')

  const renderView = () => {
    switch (activeView) {
      case 'directory':
        return <DirectoryView />
      case 'chat':
        return <ChatView />
      case 'sessions':
        return <SessionsView />
      case 'files':
        return <FilesView />
      case 'governance':
        return <GovernanceView />
      case 'wealth':
        return <WealthView />
      case 'education':
        return <EducationView />
      case 'settings':
        return <SettingsView />
      default:
        return <DirectoryView />
    }
  }

  return (
    <div className="main-app">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="main-content">
        <TopBar />
        <div className="view-container">
          {renderView()}
        </div>
      </div>
    </div>
  )
}
