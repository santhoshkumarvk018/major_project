import React, { useState, useEffect } from 'react';
import { fetchLogs } from '../utils/api';
import { FileText, Database, Shield, CheckCircle2, XCircle, Search } from 'lucide-react';

const DecisionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchLogs(50);
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Error loading logs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div className="tab-panel active">
      <div className="sh">
        <div className="sh-lbl">Transaction Audit Trail</div>
        <div style={{display:'flex', gap:'8px'}}>
          <div className="badge bg" style={{display: 'flex', alignItems: 'center', gap: 4}}><FileText size={10} /> {logs.length} Records</div>
          <div className="badge bb" style={{display: 'flex', alignItems: 'center', gap: 4}}><Database size={10} /> loan_audit.db</div>
        </div>
      </div>
      
      <div className="panel" style={{marginBottom:'24px', border: '1px solid var(--glass-border)', background: 'var(--panel)'}}>
        <div className="t-wrap">
          <table>
            <thead>
              <tr>
                <th>Principal</th>
                <th>Annual Yield</th>
                <th>DTI Ratio</th>
                <th>Credit Score</th>
                <th>ROI</th>
                <th>Outcome</th>
                <th>Risk Index</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((r, i) => (
                <tr key={i}>
                  <td style={{fontWeight: 500}}>₹{r.loan_amnt?.toLocaleString() || '—'}</td>
                  <td style={{color: 'var(--ink3)'}}>₹{r.annual_inc?.toLocaleString() || '—'}</td>
                  <td>{r.dti}%</td>
                  <td><span style={{fontFamily: 'var(--mono)', color: 'var(--accent)'}}>{r.credit_score}</span></td>
                  <td>{r.int_rate}%</td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: r.decision === 'APPROVED' ? 'var(--emerald)' : 'var(--rose)'}}>
                      {r.decision === 'APPROVED' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {r.decision}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${r.risk_flag === 'HIGH' ? 'br' : r.risk_flag === 'MEDIUM' ? 'ba' : 'bg'}`}>
                      {r.risk_flag}
                    </span>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color: 'var(--ink3)'}}>Synchronizing with persistence layer...</td></tr>}
              {!loading && logs.length === 0 && <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color: 'var(--ink3)'}}>No transaction records identified in the current ledger.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DecisionLogs;
