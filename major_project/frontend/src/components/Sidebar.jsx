import React from 'react'
import { LayoutGrid, Server, TrendingUp, ShieldCheck, User, Database, AlignLeft, Cpu } from 'lucide-react'

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
            <Cpu size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-name">LoanAudit AI</div>
            <div className="brand-sub">Enterprise v2.4.1</div>
          </div>
        </div>
        <div className="live-pill">
          <span className="live-dot"></span>
          NETWORK LIVE
        </div>
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
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.chip && <span className={`nav-chip ${item.chipClass || ''}`}>{item.chip}</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="ens-box">
          <div className="ens-lbl">System Intelligence</div>
          <div className="ens-row">
            <span className="ens-name">Core Engine</span>
            <span className="ens-val" style={{color:'var(--emerald)'}}>82.5%</span>
          </div>
          <div className="ens-row">
            <span className="ens-name">Neural Net</span>
            <span className="ens-val" style={{color:'var(--accent)'}}>80.0%</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
