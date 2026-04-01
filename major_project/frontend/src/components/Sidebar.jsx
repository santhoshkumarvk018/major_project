import React from 'react'
import { LayoutGrid, Server, TrendingUp, ShieldCheck, User, Database, AlignLeft } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid, group: 'Dashboards' },
    { id: 'backend', label: 'Backend', icon: Server, group: 'Dashboards', chip: 'API' },
    { id: 'predict', label: 'Live Predictor', icon: TrendingUp, group: 'Dashboards', chip: 'NEW', chipClass: 'hot' },
    { id: 'audit', label: 'Audit Console', icon: ShieldCheck, group: 'Risk & Audit' },
    { id: 'ai', label: 'AI Analysis', icon: User, group: 'Risk & Audit', chip: 'FREE', chipClass: 'hot' },
    { id: 'data', label: 'Data Explorer', icon: Database, group: 'Data' },
    { id: 'logs', label: 'Decision Logs', icon: AlignLeft, group: 'Data' },
  ]

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-wrap">
          <div className="logo-hex">
            <svg viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 5.8V12.2L9 16L2.5 12.2V5.8L9 2Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="2.5" fill="#fff" opacity=".9"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">LoanAudit AI</div>
            <div className="brand-sub">v2.4.1 · Enterprise</div>
          </div>
        </div>
        <div className="live-pill"><span className="live-dot"></span>LIVE · 549 RECORDS</div>
      </div>

      <nav>
        {Object.entries(groupedItems).map(([group, items]) => (
          <React.Fragment key={group}>
            <div className="nav-grp">{group}</div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={14} />
                {item.label}
                {item.chip && <span className={`nav-chip ${item.chipClass || ''}`}>{item.chip}</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="ens-box">
          <div className="ens-lbl">Model Ensemble</div>
          <div className="ens-row"><span className="ens-name">LogisticReg</span><span className="ens-val" style={{color:'#4ade80'}}>82.5% ★</span></div>
          <div className="ens-row"><span className="ens-name">RandomForest</span><span className="ens-val" style={{color:'#60a5fa'}}>80.0%</span></div>
          <div className="ens-row"><span className="ens-name">DecisionTree</span><span className="ens-val" style={{color:'rgba(245,240,232,.3)'}}>75.0%</span></div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
