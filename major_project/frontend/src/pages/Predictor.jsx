import React, { useState } from 'react';
import { predictLoan } from '../utils/api';
import { Play, RotateCcw, Trash2, CheckCircle2, XCircle, Database, Info } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">Real-time Decision Engine</div></div>
      <div className="notice pine" style={{background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--emerald)', color: 'var(--ink2)'}}>
        <Info size={14} style={{marginRight: 8, color: 'var(--emerald)'}} />
        Predictive analysis results are automatically synchronized with the primary ledger (loan_audit.db).
      </div>
      
      <div className="panel" style={{marginBottom: '24px'}}>
        <div className="ph">
          <div>
            <div className="ph-t">Applicant Parameters</div>
            <div className="ph-s">Define variables for real-time risk assessment</div>
          </div>
        </div>
        <div className="pb">
          <div className="pform">
            <div className="fg"><label className="fl">Principal Amount (₹)</label><input className="fi" id="loan_amnt" type="number" value={formData.loan_amnt} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Annual Yield (₹)</label><input className="fi" id="annual_inc" type="number" value={formData.annual_inc} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">DTI Ratio (%)</label><input className="fi" id="dti" type="number" step="0.1" value={formData.dti} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Rate of Interest (%)</label><input className="fi" id="int_rate" type="number" step="0.01" value={formData.int_rate} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Tenure/Exp (yrs)</label><input className="fi" id="experience" type="number" value={formData.experience} onChange={handleInputChange} /></div>
            <div className="fg"><label className="fl">Credit Authority Score</label><input className="fi" id="credit_score" type="number" value={formData.credit_score} onChange={handleInputChange} /></div>
          </div>

          {result && (
            <div className={`pred-result visible ${result.decision === 'APPROVED' ? 'ok' : 'no'}`} style={{background: result.decision === 'APPROVED' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)', borderColor: result.decision === 'APPROVED' ? 'var(--emerald)' : 'var(--rose)'}}>
              <div className={`pred-dec ${result.decision === 'APPROVED' ? 'ok' : 'no'}`}>
                {result.decision === 'APPROVED' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
              <div className="pred-info"><div className="pred-lbl">Outcome</div><div className="pred-v" style={{color: result.decision === 'APPROVED' ? 'var(--emerald)' : 'var(--rose)'}}>{result.decision}</div></div>
              <div className="pred-info"><div className="pred-lbl">Risk Index</div><div className="pred-v">{result.risk_flag}</div></div>
              <div className="pred-info"><div className="pred-lbl">Primary Catalyst</div><div className="pred-v">{result.key_factor}</div></div>
              <div className="pred-info"><div className="pred-lbl">Ledger Status</div><div className="pred-v" style={{color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4}}><Database size={12} /> SYNCED</div></div>
            </div>
          )}

          <div style={{display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap', marginTop: 12}}>
            <button className="btn fire" onClick={runPredict} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              {loading ? '⟳ Syncing...' : <><Play size={14} /> Execute Analysis</>}
            </button>
            <button className="btn" onClick={loadRandom} style={{display: 'flex', alignItems: 'center', gap: 8}}><RotateCcw size={14} /> Randomize Case</button>
            <button className="btn" onClick={() => setSessionLogs([])} style={{color:'var(--rose)', borderColor:'rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', gap: 8}}><Trash2 size={14} /> Purge Session</button>
          </div>
        </div>
      </div>

      <div className="pred-logs-wrap">
        <div className="pred-log-header">
          <div className="pred-log-title">Intelligence Log Stream</div>
          <div className="pred-log-count">{sessionLogs.length} Entries Recorded</div>
        </div>
        <div id="predLogTable" style={{border: '1px solid var(--glass-border)', borderRadius: 'var(--r2)'}}>
          {sessionLogs.length === 0 ? (
            <div className="empty-state">Operational log is currently empty. Execute analysis to populate.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th><th>Principal</th><th>Yield</th><th>DTI</th><th>Cred</th><th>Outcome</th><th>Index</th><th>Catalyst</th>
                </tr>
              </thead>
              <tbody>
                {sessionLogs.map((log, i) => (
                  <tr key={i}>
                    <td style={{fontSize: 11}}>{log.time}</td>
                    <td>₹{log.loan_amnt.toLocaleString()}</td>
                    <td>₹{log.annual_inc.toLocaleString()}</td>
                    <td>{log.dti}%</td><td>{log.credit_score}</td>
                    <td style={{color: log.decision === 'APPROVED' ? 'var(--emerald)' : 'var(--rose)', fontWeight: 700}}>{log.decision}</td>
                    <td><span className={`badge ${log.risk_flag === 'HIGH' ? 'br' : log.risk_flag === 'MEDIUM' ? 'ba' : 'bg'}`}>{log.risk_flag}</span></td>
                    <td style={{fontSize:'10px', color: 'var(--ink3)'}}>{log.key_factor}</td>
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
