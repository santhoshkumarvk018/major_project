import React, { useState, useEffect } from 'react';
import { fetchLogs } from '../utils/api';

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
        <div className="sh-lbl">Decision Log — data.csv Sample</div>
        <div style={{display:'flex', gap:'7px'}}>
          <span className="badge bg">{logs.length} records shown</span>
          <span className="badge bb">loan_audit.db</span>
        </div>
      </div>
      <div className="panel" style={{marginBottom:'20px'}}>
        <div className="t-wrap">
          <table>
            <thead>
              <tr><th>Loan Amt</th><th>Income</th><th>DTI</th><th>Credit</th><th>Rate</th><th>Tenure</th><th>Decision</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {logs.map((r, i) => (
                <tr key={i}>
                  <td>₹{r.loan_amnt?.toLocaleString() || '—'}</td>
                  <td>₹{r.annual_inc?.toLocaleString() || '—'}</td>
                  <td>{r.dti}%</td>
                  <td>{r.credit_score}</td>
                  <td>{r.int_rate}%</td>
                  <td>{r.experience}y</td>
                  <td className={r.decision === 'APPROVED' ? 'dapp' : 'drej'}>
                    {r.decision === 'APPROVED' ? '✓ APPROVED' : '✗ REJECTED'}
                  </td>
                  <td className={r.risk_flag === 'HIGH' ? 'rhigh' : 'rlow'}>{r.risk_flag}</td>
                </tr>
              ))}
              {loading && <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>Loading logs from database...</td></tr>}
              {!loading && logs.length === 0 && <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>No records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DecisionLogs;
