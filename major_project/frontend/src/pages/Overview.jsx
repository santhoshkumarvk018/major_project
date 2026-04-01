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
      backgroundColor: ['#e85d0440', '#e85d0430', '#e85d0422', '#e85d0415'],
      borderColor: ['#e85d04', '#e85d0490', '#e85d0455', '#e85d0430'],
      borderWidth: 1.5,
      borderRadius: 4
    }]
  };

  const loanDonutData = {
    labels: ['<₹5k', '₹5-12k', '₹12-22k', '>₹22k'],
    datasets: [{
      data: [120, 243, 129, 57],
      backgroundColor: ['#1a6b4528', '#1a4fa028', '#e85d0425', '#f0a40028'],
      borderColor: ['#1a6b45', '#1a4fa0', '#e85d04', '#f0a400'],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false }, ticks: { color: '#4a4540' } },
      y: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false }, ticks: { color: '#4a4540' } }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh">
        <div className="sh-lbl">Key Performance Indicators</div>
        <div className="sh-btn" onClick={() => window.location.reload()}>↺ Refresh</div>
      </div>
      
      <div className="kpi-grid">
        <div className="kpi" style={{'--kc': 'var(--pine)'}}>
          <div className="k-lbl">Total Decisions</div>
          <div className="k-val">{stats.total}</div>
          <div className="k-sub"><span className="up">↑ {stats.approved}</span> approved</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--sky)'}}>
          <div className="k-lbl">Approval Rate</div>
          <div className="k-val">{Math.round((stats.approved / stats.total) * 100)}%</div>
          <div className="k-sub">{stats.approved} app · {stats.rejected} rej</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--fire3)'}}>
          <div className="k-lbl">Avg Loan</div>
          <div className="k-val">{stats.avgLoan}</div>
          <div className="k-sub">₹500 — ₹35,000</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--ink2)'}}>
          <div className="k-lbl">Avg Credit Score</div>
          <div className="k-val">{stats.avgCredit}</div>
          <div className="k-sub">Avg DTI: 4.93%</div>
        </div>
        <div className="kpi" style={{'--kc': 'var(--fire)'}}>
          <div className="k-lbl">Drift Score</div>
          <div className="k-val" style={{color: 'var(--fire3)'}}>{stats.drift}</div>
          <div className="k-sub"><span className="wn">⚠ Near 0.15 threshold</span></div>
        </div>
      </div>

      <div className="sh"><div className="sh-lbl">Portfolio Distribution</div></div>
      <div className="cg c2">
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Decision Volume by Batch</div>
              <div className="ph-s">{stats.total} predictions — 4 processing batches</div>
            </div>
          </div>
          <div className="pb">
            <div style={{height: '175px'}}><Bar data={volumeData} options={chartOptions} /></div>
          </div>
        </div>
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Loan Amount Brackets</div>
              <div className="ph-s">4 size tiers — {stats.total} applications</div>
            </div>
          </div>
          <div className="pb">
            <div style={{height: '175px'}}>
              <Doughnut 
                data={loanDonutData} 
                options={{
                  ...chartOptions,
                  cutout: '62%',
                  plugins: { 
                    legend: { 
                      display: true, 
                      position: 'right', 
                      labels: { color: '#4a4540', font: { size: 9.5 }, padding: 8, boxWidth: 8 } 
                    } 
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sh"><div className="sh-lbl">Model Ensemble — Performance</div></div>
      <div className="panel">
        <div className="t-wrap">
          <table>
            <thead>
              <tr><th>Model</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1</th><th>Feature Handling</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td className="td-em">Logistic Regression</td><td className="td-best"><div className="mb"><span>82.50%</span><div className="mbb"><div className="mbf" style={{width:'56px',background:'var(--pine)'}}></div></div></div></td><td>0.8461</td><td>0.8461</td><td>0.8461</td><td>Standardized</td><td><span className="badge bg">BEST ★</span></td></tr>
              <tr><td className="td-em">Random Forest</td><td><div className="mb"><span>80.00%</span><div className="mbb"><div className="mbf" style={{width:'52px',background:'var(--sky)'}}></div></div></div></td><td>0.7692</td><td>0.7692</td><td>0.7692</td><td>Weighted</td><td><span className="badge bb">ACTIVE</span></td></tr>
              <tr><td className="td-em">Decision Tree</td><td><div className="mb"><span>75.00%</span><div className="mbb"><div className="mbf" style={{width:'44px',background:'var(--ink3)'}}></div></div></div></td><td>0.7692</td><td>0.6154</td><td>0.6841</td><td>Raw split</td><td><span className="badge bm">FALLBACK</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
