import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './styles/index.css'
import './styles/App.css'
import './styles/Login.css'
import './styles/TenantSelect.css'
import './styles/MainApp.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)