import React from 'react';
import { Bar } from 'react-chartjs-2';

const DataExplorer = () => {
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
      <div className="sh"><div className="sh-lbl">Feature Statistics — data.csv (549 records)</div></div>
      <div className="panel" style={{marginBottom:'20px'}}>
        <div className="t-wrap">
          <table>
            <thead><tr><th>Feature</th><th>Min</th><th>Mean</th><th>Max</th><th>Approved Avg</th><th>Rejected Avg</th><th>Type</th><th>Nulls</th></tr></thead>
            <tbody>
              <tr><td className="td-em">LoanAmount</td><td>₹500</td><td>₹10,496</td><td>₹35,000</td><td>₹8,902</td><td>₹13,557</td><td><span className="badge bb">REAL</span></td><td className="td-best">0</td></tr>
              <tr><td className="td-em">AnnualIncome</td><td>₹2,000</td><td>₹96,752</td><td>₹6,000,000</td><td>₹117,584</td><td>₹60,726</td><td><span className="badge bb">REAL</span></td><td className="td-best">0</td></tr>
              <tr><td className="td-em">DTI</td><td>0.00%</td><td>4.93%</td><td>27.26%</td><td><span className="td-best">0.19%</span></td><td style={{color:'var(--ember)', fontWeight:'700'}}>13.75%</td><td><span className="badge bb">REAL</span></td><td className="td-best">0</td></tr>
              <tr><td className="td-em">CreditScore</td><td>500</td><td>732</td><td>850</td><td>762</td><td>709</td><td><span className="badge bb">REAL</span></td><td className="td-best">0</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="cg ceq">
        <div className="panel">
          <div className="ph"><div><div className="ph-t">Credit Score Distribution</div><div className="ph-s">Band segments — 549 applicants</div></div></div>
          <div className="pb">
            <div style={{height:'175px'}}>
              <Bar 
                data={{
                  labels: ['<600', '600-700', '700-780', '780+'],
                  datasets: [{ data: [11, 98, 260, 180], backgroundColor: '#2a252522', borderColor: '#2a2520', borderWidth: 1.5, borderRadius: 3 }]
                }} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="ph"><div><div className="ph-t">Top Loan Purposes</div><div className="ph-s">Purpose breakdown from data.csv</div></div></div>
          <div className="pb">
            <div style={{height:'175px'}}>
              <Bar 
                data={{
                  labels: ['debt_consol.', 'other', 'home_imprv.', 'small_biz', 'major_purch.'],
                  datasets: [{ data: [146, 77, 73, 52, 49], backgroundColor: '#1a4fa020', borderColor: '#1a4fa0', borderWidth: 1.5, borderRadius: 3 }]
                }} 
                options={{ ...chartOptions, indexAxis: 'y' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
