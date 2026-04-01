import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchModels } from '../utils/api';

const Backend = () => {
  const [simRunning, setSimRunning] = useState(false);
  const [logs, setLogs] = useState([
    { ts: '[09:00:00]', lvl: 'INFO', mod: 'server.py', msg: 'Loading dataset: data.csv (549 records)' },
    { ts: '[09:00:01]', lvl: 'INFO', mod: 'preprocessing.py', msg: 'Encoding CreditGrade A–G, HomeOwnership, LoanPurpose' },
    { ts: '[09:00:02]', lvl: 'OK', mod: 'trainer.py', msg: 'RF accuracy: 0.8000 · LR: 0.8250 ★ · DT: 0.7500' },
    { ts: '[09:00:03]', lvl: 'MODEL', mod: 'trainer.py', msg: 'Saving ensemble → models/model.pkl' },
    { ts: '[09:00:03]', lvl: 'INFO', mod: 'api.py', msg: 'FastAPI ready at http://localhost:8000' }
  ]);

  const [models, setModels] = useState([
    { name: 'Logistic Regression', accuracy: 0.825, precision: 0.8461, recall: 0.8461, f1: 0.8461, status: 'BEST' },
    { name: 'Random Forest', accuracy: 0.800, precision: 0.7692, recall: 0.7692, f1: 0.7692, status: 'ACTIVE' },
    { name: 'Decision Tree', accuracy: 0.750, precision: 0.7692, recall: 0.6154, f1: 0.6841, status: 'FALLBACK' }
  ]);

  const runSimulation = async () => {
    if (simRunning) return;
    setSimRunning(true);
    setLogs([]);
    const simSteps = [
      ['INFO', 'server.py', 'Loading data.csv (549 records)'],
      ['INFO', 'preprocessing.py', 'Encoding CreditGrade A–G, HomeOwnership, LoanPurpose'],
      ['OK', 'trainer.py', 'RF: 0.8000 · LR: 0.8250 ★ · DT: 0.7500'],
      ['MODEL', 'trainer.py', 'Saved → models/model.pkl'],
      ['INFO', 'api.py', 'FastAPI ready at http://localhost:8000'],
      ['INFO', 'api.py', 'Listening for POST /predict...'],
      ['OK', 'api.py', 'POST /predict ← loan=₹10,000 DTI=2.5% score=730'],
      ['OK', 'predictor.py', 'Decision: APPROVED · Risk: LOW'],
      ['OK', 'logger.py', '✓ Written to loan_audit.db (row #1)'],
      ['WARN', 'audit.py', 'Drift: 0.14 approaching threshold 0.15']
    ];

    for (const [lvl, mod, msg] of simSteps) {
      setLogs(prev => [...prev, { ts: `[${new Date().toLocaleTimeString()}]`, lvl, mod, msg }]);
      await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
    }
    setSimRunning(false);
  };

  const featureData = {
    labels: ['credit_score', 'dti', 'loan_amnt', 'annual_inc', 'int_rate', 'experience'],
    datasets: [{
      data: [32, 24, 18, 13, 8, 5],
      backgroundColor: ['#e85d0430', '#1a4fa028', '#1a6b4525', '#f0a40025', '#e85d0420', '#dc2f0220'],
      borderColor: ['#e85d04', '#1a4fa0', '#1a6b45', '#f0a400', '#e85d04', '#dc2f02'],
      borderWidth: 1.5,
      borderRadius: 3
    }]
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Processing Pipeline</div></div>
      <div className="pipeline">
        <div className="pipe-step on"><div className="p-num">01</div><div className="p-name">Data Ingestion</div><div className="p-desc">data.csv → DataFrame</div><div className="p-arr">→</div></div>
        <div className="pipe-step on"><div className="p-num">02</div><div className="p-name">Preprocessing</div><div className="p-desc">Encode · Impute · Scale</div><div className="p-arr">→</div></div>
        <div className="pipe-step on"><div className="p-num">03</div><div className="p-name">Ensemble Train</div><div className="p-desc">RF · LR · DT models</div><div className="p-arr">→</div></div>
        <div className="pipe-step on"><div className="p-num">04</div><div className="p-name">POST /predict</div><div className="p-desc">→ Decision + SQLite log</div><div className="p-arr">→</div></div>
        <div className="pipe-step on"><div className="p-num">05</div><div className="p-name">Audit Monitor</div><div className="p-desc">Drift · Bias · Alert</div><div className="p-arr">→</div></div>
        <div className="pipe-step"><div className="p-num">06</div><div className="p-name">Auto-Retrain</div><div className="p-desc">Drift &gt; 0.15 triggers</div></div>
      </div>

      <div className="notice fire">⚡ Log writes happen ONLY on POST /predict — no passive logging. Every record in the log was triggered by a real prediction call.</div>

      <div className="sh">
        <div className="sh-lbl">Process Log</div>
        <div style={{display:'flex', gap:'7px'}}>
          <button className="btn" onClick={() => setLogs([])}>Clear</button>
          <button className="btn fire" onClick={runSimulation} disabled={simRunning}>
            {simRunning ? '⟳ Running...' : '▶ Run Simulation'}
          </button>
        </div>
      </div>
      
      <div className="logbox">
        {logs.map((log, i) => (
          <div key={i} className="ll">
            <span className="lt">{log.ts}</span>{' '}
            <span className={log.lvl === 'OK' ? 'lok' : log.lvl === 'WARN' ? 'lw' : log.lvl === 'MODEL' ? 'lm' : 'li'}>
              {log.lvl.padEnd(5)}
            </span>{' '}
            {log.mod} · {log.msg}
          </div>
        ))}
      </div>

      <div className="sh" style={{marginTop:'20px'}}><div className="sh-lbl">FastAPI Endpoints</div></div>
      <div className="panel" style={{marginBottom:'20px'}}>
        <div className="t-wrap">
          <table>
            <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Logs?</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><span className="badge ba">POST</span></td><td>/predict</td><td className="td-em" style={{fontSize:'11px'}}>Single loan prediction — <strong>writes log to SQLite</strong></td><td><span className="badge bg">YES ✓</span></td><td><span className="badge bg">LIVE</span></td></tr>
              <tr><td><span className="badge bb">GET</span></td><td>/logs</td><td className="td-em" style={{fontSize:'11px'}}>Retrieve prediction logs (read only)</td><td><span className="badge bm">NO</span></td><td><span className="badge bg">LIVE</span></td></tr>
              <tr><td><span className="badge bb">GET</span></td><td>/audit/drift</td><td className="td-em" style={{fontSize:'11px'}}>Drift score + alert flag</td><td><span className="badge bm">NO</span></td><td><span className="badge bg">LIVE</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sh"><div className="sh-lbl">Feature Importance (Random Forest)</div></div>
      <div className="panel">
        <div className="pb">
          <div style={{height:'200px'}}>
            <Bar 
              data={featureData} 
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false }, title: { display: true, text: 'Importance (%)' } },
                  y: { grid: { color: 'rgba(15,13,10,.07)', drawBorder: false } }
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
