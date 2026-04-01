import React, { useState } from 'react';
import { predictLoan } from '../utils/api';

const Predictor = () => {
  const [formData, setFormData] = useState({
    loan_amnt: 10000,
    annual_inc: 70000,
    dti: 2.5,
    int_rate: 12.0,
    experience: 5,
    credit_score: 730
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionLogs, setSessionLogs] = useState([]);

  const samples = [
    [8000, 36000, 0.47, 7.2, 3, 600],
    [6000, 50000, 0, 16.8, 4, 700],
    [25000, 55164, 0, 14.3, 10, 700],
    [9000, 63000, 0.29, 19.2, 1, 800],
    [20000, 60000, 0, 17.7, 8, 700],
    [10000, 70000, 2.5, 12.0, 5, 730],
    [7000, 48000, 10.35, 19.3, 10, 800],
    [15000, 90000, 17.85, 11.5, 9, 750]
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: parseFloat(value) }));
  };

  const loadRandom = () => {
    const s = samples[Math.floor(Math.random() * samples.length)];
    setFormData({
      loan_amnt: s[0],
      annual_inc: s[1],
      dti: s[2],
      int_rate: s[3],
      experience: s[4],
      credit_score: s[5]
    });
  };

  const runPredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await predictLoan(formData);
      setResult(data);
      setSessionLogs(prev => [{
        ...data,
        ...formData,
        time: new Date().toLocaleTimeString()
      }, ...prev]);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to reach backend API. Ensure server.py is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Live Predictor — POST /predict → Log Saved</div></div>
      <div className="notice pine">✓ Every prediction below calls POST /predict on the backend and saves the result to loan_audit.db automatically.</div>
      
      <div className="panel" style={{marginBottom: '16px'}}>
        <div className="ph"><div><div className="ph-t">New Loan Application</div><div className="ph-s">Fill in applicant details — result is logged to SQLite on submit</div></div></div>
        <div className="pb">
          <div className="pform">
            <div className="fg"><label className="fl">Loan Amount (₹)</label><input className="fi" id="loan_amnt" type="number" value={formData.loan_amnt} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Annual Income (₹)</label><input className="fi" id="annual_inc" type="number" value={formData.annual_inc} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">DTI (%)</label><input className="fi" id="dti" type="number" step="0.1" value={formData.dti} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Interest Rate (%)</label><input className="fi" id="int_rate" type="number" step="0.01" value={formData.int_rate} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Experience (yrs)</label><input className="fi" id="experience" type="number" value={formData.experience} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Credit Score</label><input className="fi" id="credit_score" type="number" value={formData.credit_score} onChange={handleInputChange} /></div>
          </div>

          {result && (
            <div className="pred-result visible">
              <div className={`pred-dec ${result.decision === 'APPROVED' ? 'ok' : 'no'}`}>
                {result.decision === 'APPROVED' ? '✓' : '✗'}
              </div>
              <div className="pred-info"><div className="pred-lbl">Decision</div><div className="pred-v">{result.decision}</div></div>
              <div className="pred-info"><div className="pred-lbl">Risk Level</div><div className="pred-v">{result.risk_flag}</div></div>
              <div className="pred-info"><div className="pred-lbl">Key Factor</div><div className="pred-v">{result.key_factor}</div></div>
              <div className="pred-info"><div className="pred-lbl">Log Status</div><div className="pred-v" style={{color:'var(--pine)'}}>✓ Saved to DB</div></div>
            </div>
          )}

          <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
            <button className="btn fire" onClick={runPredict} disabled={loading}>
              {loading ? '⟳ Processing...' : '▶ Predict & Save Log'}
            </button>
            <button className="btn" onClick={loadRandom}>⟳ Load Sample</button>
            <button className="btn" onClick={() => setSessionLogs([])} style={{color:'var(--ember)', borderColor:'var(--ember)'}}>✕ Clear Session Logs</button>
          </div>
        </div>
      </div>

      <div className="pred-logs-wrap">
        <div className="pred-log-header">
          <div className="pred-log-title">📋 Session Prediction Log</div>
          <div className="pred-log-count">{sessionLogs.length} predictions logged this session</div>
        </div>
        <div id="predLogTable">
          {sessionLogs.length === 0 ? (
            <div className="empty-state">No predictions yet — run a prediction above to log a result.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Time</th><th>Loan Amt</th><th>Income</th><th>DTI</th><th>Credit</th><th>Rate</th><th>Decision</th><th>Risk</th><th>Key Factor</th>
                </tr>
              </thead>
              <tbody>
                {sessionLogs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.time}</td>
                    <td>₹{log.loan_amnt.toLocaleString()}</td>
                    <td>₹{log.annual_inc.toLocaleString()}</td>
                    <td>{log.dti}%</td><td>{log.credit_score}</td><td>{log.int_rate}%</td>
                    <td className={log.decision === 'APPROVED' ? 'dapp' : 'drej'}>{log.decision}</td>
                    <td className={log.risk_flag === 'HIGH' ? 'rhigh' : log.risk_flag === 'MEDIUM' ? 'rmed' : 'rlow'}>{log.risk_flag}</td>
                    <td style={{fontSize:'10px'}}>{log.key_factor} <span style={{color:'var(--pine)', fontWeight:700}}>✓ DB</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictor;
