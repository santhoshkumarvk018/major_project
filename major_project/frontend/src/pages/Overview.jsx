import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { fetchLogs } from '../utils/api';
import { ArrowUpRight, ArrowDownRight, Activity, ShieldCheck, Zap } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Overview = () => {
  const [stats, setStats] = useState({
    total: 549,
    approved: 357,
    rejected: 192,
    avgLoan: '₹10.5k',
    avgCredit: 732,
    drift: 0.14
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchLogs(1000);
        const logs = data.logs || [];
        if (logs.length > 0) {
          const total = logs.length;
          const approved = logs.filter(log => log.decision === 'APPROVED').length;
          setStats(prev => ({
            ...prev,
            total,
            approved,
            rejected: total - approved
          }));
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };
    loadStats();
  }, []);

  const volumeData = {
    labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'],
    datasets: [{
      data: [138, 137, 137, 137],
      backgroundColor: ['#3b82f6aa', '#6366f1aa', '#8b5cfaa',' #a855f7aa'],
      borderColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const loanDonutData = {
    labels: ['<₹5k', '₹5-12k', '₹12-22k', '>₹22k'],
    datasets: [{
      data: [120, 243, 129, 57],
      backgroundColor: ['#10b981aa', '#3b82f6aa', '#f59e0baa', '#f43f5eaa'],
      borderColor: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'],
      borderWidth: 1.5,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 6,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh">
        <div className="sh-lbl">Key Intelligence Indicators</div>
        <div className="sh-btn" onClick={() => window.location.reload()}>Sync Core</div>
      </div>
      
      <div className="kpi-grid">
        <div className="kpi" style={{'--kc': 'var(--emerald)'}}>
          <div className="k-lbl">Total Decisions</div>
          <div className="k-val">{stats.total}</div>
          <div className="k-sub">
            <span className="up"><ArrowUpRight size={12} /> {Math.round((stats.approved/stats.total)*100)}%</span> 
            <span>Approval Rate</span>
          </div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--accent)'}}>
          <div className="k-lbl">Active Node</div>
          <div className="k-val">NODE-01</div>
          <div className="k-sub"><Zap size={11} /> High Performance</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--amber)'}}>
          <div className="k-lbl">Avg Loan</div>
          <div className="k-val">{stats.avgLoan}</div>
          <div className="k-sub">± ₹1,204 deviance</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--violet)'}}>
          <div className="k-lbl">Credit Latency</div>
          <div className="k-val">12ms</div>
          <div className="k-sub"><Activity size={11} /> Real-time Sync</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--rose)'}}>
          <div className="k-lbl">Drift Score</div>
          <div className="k-val" style={{color: 'var(--rose)'}}>{stats.drift}</div>
          <div className="k-sub" style={{color: 'var(--amber)'}}>⚠ Limit: 0.15</div>
        </div>
      </div>

      <div className="sh"><div className="sh-lbl">Portfolio Architecture</div></div>
      <div className="cg c2">
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Decision Volume</div>
              <div className="ph-s">Batched processing distribution across clusters</div>
            </div>
          </div>
          <div className="pb">
            <div style={{height: '240px'}}><Bar data={volumeData} options={chartOptions} /></div>
          </div>
        </div>
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Capital Exposure</div>
              <div className="ph-s">Segmented loan tiers</div>
            </div>
          </div>
          <div className="pb">
            <div style={{height: '240px'}}>
              <Doughnut 
                data={loanDonutData} 
                options={{
                  ...chartOptions,
                  cutout: '72%',
                  plugins: { 
                    legend: { 
                      display: true, 
                      position: 'bottom', 
                      labels: { color: '#94a3b8', font: { size: 10, family: 'Inter' }, padding: 15, boxWidth: 8, usePointStyle: true } 
                    } 
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sh"><div className="sh-lbl">Model Ensemble Architecture</div></div>
      <div className="panel">
        <div className="t-wrap">
          <table>
            <thead>
              <tr><th>Agent Model</th><th>Stability</th><th>Performance Index</th><th>Handling</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td className="td-em">LR-Agent-01</td><td className="td-best"><div className="mb"><div className="mbb"><div className="mbf" style={{width:'85px',background:'var(--emerald)'}}></div></div><span>82.5%</span></div></td><td>0.8461</td><td>Normalized</td><td><span className="badge bg">Primary</span></td></tr>
              <tr><td className="td-em">RF-Agent-02</td><td><div className="mb"><div className="mbb"><div className="mbf" style={{width:'80px',background:'var(--accent)'}}></div></div><span>80.0%</span></div></td><td>0.7692</td><td>Weighted</td><td><span className="badge ba">Active</span></td></tr>
              <tr><td className="td-em">DT-Agent-03</td><td><div className="mb"><div className="mbb"><div className="mbf" style={{width:'75px',background:'var(--violet)'}}></div></div><span>75.0%</span></div></td><td>0.6154</td><td>Raw</td><td><span className="badge bb">Shadow</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
