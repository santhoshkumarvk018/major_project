import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { ShieldCheck, Activity, Scale, CheckCircle2, AlertTriangle, Database, Clock } from 'lucide-react';

const Audit = () => {
  const driftTimeData = {
    labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Current'],
    datasets: [{
      label: 'Drift Score',
      data: [0.04, 0.08, 0.13, 0.19, 0.14],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6'
    }, {
      label: 'Threshold',
      data: [0.15, 0.15, 0.15, 0.15, 0.15],
      borderColor: 'rgba(244, 63, 94, 0.3)',
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 6,
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } }, min: 0, max: 0.25 }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Governance & Compliance Metrics</div></div>
      
      <div className="audit-strip">
        <div className="ac">
          <Activity className="ac-icon" style={{color: 'var(--amber)', opacity: 0.2}} size={40} />
          <div className="ac-lbl">Model Drift</div>
          <div className="ac-score" style={{color: 'var(--amber)'}}>0.14</div>
          <div className="ac-note">Critical Threshold: 0.15</div>
          <div className="ac-bar"><div className="ac-fill" style={{width:'93%', background:'var(--amber)'}}></div></div>
        </div>
        <div className="ac">
          <Scale className="ac-icon" style={{color: 'var(--emerald)', opacity: 0.2}} size={40} />
          <div className="ac-lbl">Statistical Bias</div>
          <div className="ac-score" style={{color: 'var(--emerald)'}}>0.02</div>
          <div className="ac-note">Variance within tolerance</div>
          <div className="ac-bar"><div className="ac-fill" style={{width:'20%', background:'var(--emerald)'}}></div></div>
        </div>
        <div className="ac">
          <ShieldCheck className="ac-icon" style={{color: 'var(--accent)', opacity: 0.2}} size={40} />
          <div className="ac-lbl">System Integrity</div>
          <div className="ac-score" style={{color: 'var(--accent)'}}>SECURE</div>
          <div className="ac-note">Operational ledger verified</div>
          <div className="ac-bar"><div className="ac-fill" style={{width:'100%', background:'var(--accent)'}}></div></div>
        </div>
      </div>

      <div className="cg ceq">
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Drift Progression Analysis</div>
              <div className="ph-s">Statistical divergence per transaction batch</div>
            </div>
          </div>
          <div className="pb"><div style={{height:'200px'}}><Line data={driftTimeData} options={chartOptions} /></div></div>
        </div>
        <div className="panel">
          <div className="ph">
            <div>
              <div className="ph-t">Feature Distribution Shift</div>
              <div className="ph-s">Comparative segmentation of historical vs recent data</div>
            </div>
          </div>
          <div className="pb"><div style={{height:'200px'}}>
          <Bar 
            data={{
              labels: ['Loan Principal', 'DTI Ratio', 'Interest Rate'],
              datasets: [{
                label: 'Baseline',
                data: [10.2, 4.9, 13.2],
                backgroundColor: 'rgba(59, 130, 246, 0.4)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 4
              }, {
                label: 'Current',
                data: [10.8, 5.0, 14.0],
                backgroundColor: 'rgba(139, 92, 246, 0.4)',
                borderColor: '#8b5cf6',
                borderWidth: 1,
                borderRadius: 4
              }]
            }} 
            options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins, legend: { display: true, position: 'bottom', labels: { color: '#94a3b8', font: { size: 10, family: 'Inter' }, padding: 15, boxWidth: 10 } } },
              scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 20 } }
            }} 
          />
        </div></div></div>
      </div>

      <div className="sh" style={{marginTop: 32}}><div className="sh-lbl">Operational Audit Timeline</div></div>
      <div className="panel" style={{background: 'var(--glass)', border: '1px solid var(--glass-border)'}}>
        <div className="pb">
          <div className="tl">
            <div className="tl-row">
              <div className="tl-spine"><CheckCircle2 className="tl-dot g" size={14} /><div className="tl-line"></div></div>
              <div className="tl-body">
                <div className="tl-title">System Verified — Variance Within Tolerance</div>
                <div className="tl-meta">March 25, 2026 · Index: 0.14 · Bias: 0.02 · Status: PASS</div>
              </div>
            </div>
            <div className="tl-row">
              <div className="tl-spine"><Database className="tl-dot b" size={14} /><div className="tl-line"></div></div>
              <div className="tl-body">
                <div className="tl-title">Transaction Ledger Synchronized</div>
                <div className="tl-meta">March 25, 2026 · Batch #549 processed and committed to persistence layer.</div>
              </div>
            </div>
            <div className="tl-row">
              <div className="tl-spine"><Clock className="tl-dot v" size={14} /><div className="tl-line"></div></div>
              <div className="tl-body">
                <div className="tl-title">Scheduled Health Check Completed</div>
                <div className="tl-meta">March 25, 2026 · All model clusters reporting operational stability.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
