import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import TabBar from './components/TabBar'
import Overview from './pages/Overview'
import Backend from './pages/Backend'
import Predictor from './pages/Predictor'
import Audit from './pages/Audit'
import AIAnalysis from './pages/AIAnalysis'
import DataExplorer from './pages/DataExplorer'
import DecisionLogs from './pages/DecisionLogs'

const App = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'backend': return <Backend />
      case 'predict': return <Predictor />
      case 'audit': return <Audit />
      case 'ai': return <AIAnalysis />
      case 'data': return <DataExplorer />
      case 'logs': return <DecisionLogs />
      default: return <Overview />
    }
  }

  return (
    <div className="shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        <Topbar activeTab={activeTab} currentTime={currentTime} />
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
