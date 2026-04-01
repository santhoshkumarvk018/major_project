import React from 'react'
import { Bell, User, Layout } from 'lucide-react'

const Topbar = ({ activeTab, currentTime }) => {
  return (
    <div className="topbar">
      <div className="tb-left">
        <div className="tb-crumb">System / Analytics</div>
        <div className="tb-page">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
      </div>
      
      <div className="tb-right">
        <div className="tb-ts">{currentTime}</div>
        <div className="health-tag">
          <span className="live-dot" style={{width: 8, height: 8}}></span>
          NODE-01 OK
        </div>
        <div style={{width: 1, height: 20, background: 'var(--glass-border)', margin: '0 8px'}}></div>
        <div className="sh-btn" style={{padding: '5px 8px', border: 'none', background: 'transparent'}}>
          <Bell size={18} />
        </div>
        <div className="logo-hex" style={{width: 32, height: 32, borderRadius: 8, background: 'var(--glass)', border: '1px solid var(--glass-border)', boxShadow: 'none'}}>
          <User size={16} color="var(--ink2)" />
        </div>
      </div>
    </div>
  )
}

export default Topbar
