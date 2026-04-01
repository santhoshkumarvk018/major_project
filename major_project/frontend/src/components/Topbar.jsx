import React from 'react'

const Topbar = ({ activeTab, currentTime }) => {
  const pageName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)

  return (
    <div className="topbar">
      <div className="tb-left">
        <span className="tb-crumb">loanaudit.ai /</span>
        <span className="tb-page-name">{pageName}</span>
      </div>
      <div className="tb-right">
        <span className="tb-ts">{currentTime}</span>
        <div className="health-tag">● HEALTHY</div>
      </div>
    </div>
  )
}

export default Topbar
