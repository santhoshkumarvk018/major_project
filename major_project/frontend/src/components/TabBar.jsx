import React from 'react'

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'backend', label: 'Backend' },
    { id: 'predict', label: 'Live' },
    { id: 'audit', label: 'Audit' },
    { id: 'ai', label: 'AI Review' },
    { id: 'data', label: 'Explorer' },
    { id: 'logs', label: 'Logs' },
  ]

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}

export default TabBar
