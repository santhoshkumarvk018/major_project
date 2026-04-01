import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Database, Filter, BarChart3, PieChart, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DataExplorer = () => {
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
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 10 } } }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="sh">
        <div className="sh-lbl">Feature Variance Analytics</div>
        <div className="badge bg" style={{display: 'flex', alignItems: 'center', gap: 4}}><Database size={10} /> 549 Records Sync</div>
      </div>
      
      <div className="panel" style={{marginBottom:'24px', border: '1px solid var(--glass-border)', background: 'var(--panel)'}}>
        <div className="t-wrap">
          <table>
            <thead>
              <tr><th>Feature Variable</th><th>Min</th><th>Mean</th><th>Max</th><th>Approved Mu</th><th>Rejected Mu</th><th>Category</th><th>Nulls</th></tr>
            </thead>
            <tbody>
              <tr><td className="td-em" style={{color: 'var(--ink)'}}>Loan Amount</td><td>₹500</td><td>₹10,496</td><td>₹35,000</td><td>₹8,902</td><td>₹13,557</td><td><span className="badge bb">Quant</span></td><td style={{color: 'var(--emerald)'}}>0</td></tr>
              <tr><td className="td-em" style={{color: 'var(--ink)'}}>Annual Yield</td><td>₹2,000</td><td>₹96,752</td><td>₹6.0M</td><td>₹117.6k</td><td>₹60.7k</td><td><span className="badge bb">Quant</span></td><td style={{color: 'var(--emerald)'}}>0</td></tr>
              <tr><td className="td-em" style={{color: 'var(--ink)'}}>DTI Ratio</td><td>0.00%</td><td>4.93%</td><td>27.26%</td><td><span style={{color: 'var(--emerald)', fontWeight: 600}}>0.19%</span></td><td style={{color:'var(--rose)', fontWeight: 600}}>13.75%</td><td><span className="badge bb">Quant</span></td><td style={{color: 'var(--emerald)'}}>0</td></tr>
              <tr><td className="td-em" style={{color: 'var(--ink)'}}>Authority Score</td><td>500</td><td>732</td><td>850</td><td>762</td><td>709</td><td><span className="badge bb">Quant</span></td><td style={{color: 'var(--emerald)'}}>0</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cg ceq">
        <div className="panel" style={{border: '1px solid var(--glass-border)'}}>
          <div className="ph">
            <div>
              <div className="ph-t">Authority Score Distribution</div>
              <div className="ph-s">Frequency segmentation across 549 applicants</div>
            </div>
          </div>
          <div className="pb" style={{padding: '0 20px 20px'}}>
            <div style={{height:'200px'}}>
              <Bar 
                data={{
                  labels: ['<600', '600-700', '700-780', '780+'],
                  datasets: [{ 
                    data: [11, 98, 260, 180], 
                    backgroundColor: 'rgba(59, 130, 246, 0.4)', 
                    borderColor: '#3b82f6', 
                    borderWidth: 1, 
                    borderRadius: 4 
                  }]
                }} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
        
        <div className="panel" style={{border: '1px solid var(--glass-border)'}}>
          <div className="ph">
            <div>
              <div className="ph-t">Primary Allocation Purposes</div>
              <div className="ph-s">Intent-based segmentation from records</div>
            </div>
          </div>
          <div className="pb" style={{padding: '0 20px 20px'}}>
            <div style={{height:'200px'}}>
              <Bar 
                data={{
                  labels: ['Consolidation', 'Other', 'Home Imp', 'Small Biz', 'Major Pur.'],
                  datasets: [{ 
                    data: [146, 77, 73, 52, 49], 
                    backgroundColor: 'rgba(139, 92, 246, 0.4)', 
                    borderColor: '#8b5cf6', 
                    borderWidth: 1, 
                    borderRadius: 4 
                  }]
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
