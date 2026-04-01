import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchModels } from '../utils/api';
import { Activity, Database, Server, Cpu, Link, Terminal, Play, Trash2, Info } from 'lucide-react';

const Backend = () => {
  const [simRunning, setSimRunning] = useState(false);
  const [logs, setLogs] = useState([
    { ts: '[09:00:00]', lvl: 'INFO', mod: 'kernel.py', msg: 'System initialization sequence started.' },
    { ts: '[09:00:01]', lvl: 'INFO', mod: 'processor.py', msg: 'Normalizing feature vectors for 549 active records.' },
    { ts: '[09:00:02]', lvl: 'OK', mod: 'ensemble.py', msg: 'Model synchronization complete: LR (82.5%) verified.' },
    { ts: '[09:00:03]', lvl: 'INFO', mod: 'gateway.py', msg: 'FastAPI interface established at port 8000.' }
  ]);

  const runSimulation = async () => {
    if (simRunning) return;
    setSimRunning(true);
    setLogs([]);
    const simSteps = [
      ['INFO', 'source.py', 'Ingesting data.csv (549 records)'],
      ['INFO', 'parser.py', 'Applying categorical encodings and scaling'],
      ['OK', 'trainer.py', 'Ensemble stability: 0.8250 (LR-Agent)'],
      ['MODEL', 'trainer.py', 'Commiting model weights to persistent storage'],
      ['INFO', 'api.py', 'Service operational at http://localhost:8000'],
      ['OK', 'api.py', 'Inbound request: POST /predict (ID: #X92)'],
      ['OK', 'engine.py', 'Outcome: APPROVED (Confidence: 94.2%)'],
      ['OK', 'ledger.py', 'Transaction written to loan_audit.db'],
      ['WARN', 'audit.py', 'Anomaly detected: Drift index at 0.14']
    ];

    for (const [lvl, mod, msg] of simSteps) {
      setLogs(prev => [...prev, { ts: `[${new Date().toLocaleTimeString()}]`, lvl, mod, msg }]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    }
    setSimRunning(false);
  };

  const featureData = {
    labels: ['Credit Score', 'DTI Ratio', 'Principal', 'Yield', 'Rate', 'Experience'],
    datasets: [{
      data: [32, 24, 18, 13, 8, 5],
      backgroundColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Enterprise Processing Pipeline</div></div>
      <div className="pipeline">
        <div className="pipe-step on">
          <div className="p-num">01</div>
          <div className="p-name">Ingestion</div>
          <div className="p-desc">Secure Data Streaming</div>
        </div>
        <div className="pipe-step on">
          <div className="p-num">02</div>
          <div className="p-name">Refining</div>
          <div className="p-desc">Vector Normalization</div>
        </div>
        <div className="pipe-step on">
          <div className="p-num">03</div>
          <div className="p-name">Syncing</div>
          <div className="p-desc">Model Cluster Align</div>
        </div>
        <div className="pipe-step on">
          <div className="p-num">04</div>
          <div className="p-name">Interface</div>
          <div className="p-desc">REST API Gateway</div>
        </div>
        <div className="pipe-step">
          <div className="p-num">05</div>
          <div className="p-name">Retraining</div>
          <div className="p-desc">Autonomous Updates</div>
        </div>
      </div>

      <div className="notice fire" style={{background: 'rgba(59, 130, 246, 0.05)', borderColor: 'var(--accent)', color: 'var(--ink2)'}}>
        <Info size={14} style={{marginRight: 8, color: 'var(--accent)'}} />
        Persistence layer synchronization occurs exclusively during active prediction sequences. Passive telemetry is not recorded.
      </div>

      <div className="sh" style={{marginTop: 32}}>
        <div className="sh-lbl" style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Terminal size={14} /> Process Execution Log
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          <button className="btn" onClick={() => setLogs([])}><Trash2 size={12} /></button>
          <button className="btn fire" onClick={runSimulation} disabled={simRunning} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            {simRunning ? 'Executing...' : <><Play size={12} /> Start Sim</>}
          </button>
        </div>
      </div>
      
      <div className="logbox" style={{background: '#020617', border: '1px solid var(--glass-border)'}}>
        {logs.map((log, i) => (
          <div key={i} className="ll">
            <span className="lt" style={{color: 'var(--ink3)'}}>{log.ts}</span>
            <span className={`badge ${log.lvl === 'OK' ? 'bg' : log.lvl === 'WARN' ? 'ba' : log.lvl === 'MODEL' ? 'bb' : 'bm'}`} style={{fontSize: 9, padding: '1px 6px', marginRight: 8}}>
              {log.lvl}
            </span>
            <span style={{color: 'var(--ink2)', fontFamily: 'var(--sans)', fontSize: 11}}>{log.mod}</span>
            <span style={{color: 'var(--ink3)', margin: '0 8px'}}>→</span>
            <span style={{color: 'var(--ink2)'}}>{log.msg}</span>
          </div>
        ))}
      </div>

      <div className="sh" style={{marginTop:'32px'}}><div className="sh-lbl">API Gateway Endpoints</div></div>
      <div className="panel" style={{border: '1px solid var(--glass-border)'}}>
        <div className="t-wrap">
          <table>
            <thead><tr><th>Method</th><th>Endpoint</th><th>Service Description</th><th>Persistence</th><th>Registry</th></tr></thead>
            <tbody>
              <tr><td><span className="badge ba">POST</span></td><td><code>/predict</code></td><td className="td-em">Real-time inference & synchronization</td><td><span className="badge bg">Enabled</span></td><td><span className="badge bg">Operational</span></td></tr>
              <tr><td><span className="badge bb">GET</span></td><td><code>/logs</code></td><td className="td-em">Telemetry data retrieval</td><td><span className="badge bm">Read-Only</span></td><td><span className="badge bg">Operational</span></td></tr>
              <tr><td><span className="badge bb">GET</span></td><td><code>/audit/drift</code></td><td className="td-em">Governance & drift analytics</td><td><span className="badge bm">Read-Only</span></td><td><span className="badge bg">Operational</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sh" style={{marginTop: 32}}><div className="sh-lbl">Feature Variance Weighting</div></div>
      <div className="panel" style={{background: 'var(--panel)', border: '1px solid var(--glass-border)'}}>
        <div className="pb" style={{padding: 24}}>
          <div style={{height:'220px'}}>
            <Bar 
              data={featureData} 
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b' }, title: { display: true, text: 'Relative Influence (%)', color: '#64748b', font: { family: 'Inter', size: 10 } } },
                  y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } } }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backend;
