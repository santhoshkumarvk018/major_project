import React from 'react';
import { Line, Bar } from 'react-chartjs-2';

const Audit = () => {
  const driftTimeData = {
    labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Current'],
    datasets: [{
      label: 'Drift Score',
      data: [0.04, 0.08, 0.13, 0.19, 0.14],
      borderColor: '#e85d04',
      backgroundColor: '#e85d0412',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#e85d04'
    }, {
      label: 'Threshold',
      data: [0.15, 0.15, 0.15, 0.15, 0.15],
      borderColor: '#dc2f0250',
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false }, ticks: { color: '#4a4540' } },
      y: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false }, ticks: { color: '#4a4540' }, min: 0, max: 0.25 }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Audit Metrics — Current State</div></div>
      <div className="audit-strip">
        <div className="ac"><div className="ac-icon">⚡</div><div className="ac-lbl">Drift Score</div><div className="ac-score w">0.14</div><div className="ac-note">Threshold: 0.15 · Near alert</div><div className="ac-bar"><div className="ac-fill" style={{width:'93%', background:'var(--fire3)'}}></div></div></div>
        <div className="ac"><div className="ac-icon">⚖</div><div className="ac-lbl">Bias Score</div><div className="ac-score g">0.02</div><div className="ac-note">Threshold: 0.10 · Within bounds</div><div className="ac-bar"><div className="ac-fill" style={{width:'20%', background:'var(--pine)'}}></div></div></div>
        <div className="ac"><div className="ac-icon">✓</div><div className="ac-lbl">System Status</div><div className="ac-score g">OK</div><div className="ac-note">Stable · No retrain needed</div><div className="ac-bar"><div className="ac-fill" style={{width:'100%', background:'var(--pine)'}}></div></div></div>
      </div>

      <div className="cg ceq" style={{marginBottom:'20px'}}>
        <div className="panel"><div className="ph"><div><div className="ph-t">Drift Score Over Time</div><div className="ph-s">KL-divergence per session batch</div></div></div><div className="pb"><div style={{height:'175px'}}><Line data={driftTimeData} options={chartOptions} /></div></div></div>
        <div className="panel"><div className="ph"><div><div className="ph-t">Portfolio Feature Shift</div><div className="ph-s">First 275 vs last 274 records</div></div></div><div className="pb"><div style={{height:'175px'}}>
          <Bar 
            data={{
              labels: ['Avg Loan (₹k)', 'Avg DTI (%)', 'Avg Rate (%)'],
              datasets: [{
                label: 'First 275',
                data: [10.2, 4.9, 13.2],
                backgroundColor: '#1a4fa022',
                borderColor: '#1a4fa0',
                borderWidth: 1.5,
                borderRadius: 3
              }, {
                label: 'Last 274',
                data: [10.8, 5.0, 14.0],
                backgroundColor: '#e85d0422',
                borderColor: '#e85d04',
                borderWidth: 1.5,
                borderRadius: 3
              }]
            }} 
            options={{
              ...chartOptions,
              plugins: { legend: { display: true, labels: { color: '#4a4540', font: { size: 9.5 }, boxWidth: 10 } } },
              scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 20 } }
            }} 
          />
        </div></div></div>
      </div>

      <div className="sh"><div className="sh-lbl">Audit Event Timeline</div></div>
      <div className="panel"><div className="pb">
        <div className="tl">
          <div className="tl-row"><div className="tl-spine"><div className="tl-dot g"></div><div className="tl-line"></div></div><div className="tl-body"><div className="tl-title">System healthy — drift below threshold</div><div className="tl-meta">2026-03-25 09:00 · Drift: 0.14 · Bias: 0.02</div></div></div>
          <div className="tl-row"><div className="tl-spine"><div className="tl-dot b"></div><div className="tl-line"></div></div><div className="tl-body"><div className="tl-title">POST /predict received — log written to SQLite</div><div className="tl-meta">2026-03-25 09:00 · loan=₹10,000 DTI=2.5% → APPROVED → row saved</div></div></div>
          <div className="tl-row"><div className="tl-spine"><div className="tl-dot w"></div><div className="tl-line"></div></div><div className="tl-body"><div className="tl-title">Drift alert — 0.14 approaching threshold 0.15</div><div className="tl-meta">2026-03-25 09:00 · Rejected avg DTI 13.75% vs approved 0.19%</div></div></div>
        </div>
      </div></div>
    </div>
  );
};

export default Audit;
