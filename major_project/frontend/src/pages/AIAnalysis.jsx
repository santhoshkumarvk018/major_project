import React, { useState } from 'react';
import { analyzeAI } from '../utils/api';
import { BrainCircuit, LineChart, FileText, Lightbulb, Search, Sparkles, AlertTriangle } from 'lucide-react';

const AIAnalysis = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Initialize a query to see performance insights.');
  const [loading, setLoading] = useState(false);
  const [driftResponse, setDriftResponse] = useState('Explanation of current skew in approvals.');
  const [modelResponse, setModelResponse] = useState('Comparative analysis of agent effectiveness.');
  const [riskResponse, setRiskResponse] = useState('Actionable portfolio optimizations.');

  const systemPrompt = 'You are a senior quantitative risk analyst. Real data.csv stats: 549 records, 65% approval (357/192). Avg loan ₹10,496. Avg income ₹96,752. Avg DTI 4.93% (approved 0.19% vs rejected 13.75%). Avg credit 732. Avg rate 13.59%. LR 82.5% (best), RF 80%, DT 75%. Drift 0.14 (threshold 0.15). Bias 0.02. Grades: A=180,B=166,C=94,D=63,E=35,F=7,G=4. Logging only on POST /predict. Be concise and expert.';

  const handleQuery = async (msg, setter) => {
    setter('⟳ Processing request with Risk Intelligence Engine...');
    try {
      const data = await analyzeAI(msg, systemPrompt);
      setter(data.result);
    } catch (error) {
      setter('⚠ Connection Error: ' + error.message);
    }
  };

  const runFullAnalysis = () => {
    setLoading(true);
    setResponse('⟳ Generating comprehensive portfolio report...');
    handleQuery('Comprehensive risk assessment: 1) 65% approval with DTI divergence. 2) Drift 0.14 root cause. 3) Grade A/B concentration. 4) LR dominance. 5) Top 3 actions.', setResponse)
      .finally(() => setLoading(false));
  };

  const quickQueries = {
    drift: 'Explain the current 0.14 drift score. Approved avg DTI 0.19% vs rejected 13.75% — clarify this divergence.',
    model: 'Provide technical justification for LR (82.5%) outperforming RF (80%) on this specific data structure.',
    risk: 'Recommend 3 high-impact risk mitigations based on 65% approval and 0.14 drift.'
  };

  return (
    <div className="tab-panel active">
      <div className="sh">
        <div className="sh-lbl">Risk Intelligence Interface</div>
        <div className="sh-btn" onClick={runFullAnalysis} style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <Sparkles size={11} /> Generate Report
        </div>
      </div>
      
      <div className="notice pine" style={{background: 'rgba(59, 130, 246, 0.05)', borderColor: 'var(--accent)', color: 'var(--ink2)'}}>
        <BrainCircuit size={14} style={{marginRight: 8, color: 'var(--accent)'}} />
        Neural analysis enabled (Llama-3.1 via Groq). Context window synchronized with 549 active records.
      </div>
      
      <div className="ai-box" style={{border: '1px solid var(--glass-border)', boxShadow: loading ? '0 0 20px var(--accent-glow)' : 'none', transition: 'var(--transition)'}}>
        <div className="ai-head" style={{background: 'var(--panel)', borderBottom: '1px solid var(--glass-border)'}}>
          <div className="ai-title" style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)'}}>
            <FileText size={14} /> Comprehensive Portfolio Analysis
          </div>
          <button className="btn fire" onClick={runFullAnalysis} disabled={loading} style={{padding: '5px 12px'}}>
            {loading ? 'Processing...' : 'Execute Analysis'}
          </button>
        </div>
        <div className="ai-body" style={{background: 'transparent'}}>
          <div className={`ai-out ${response.includes('Initialize') ? 'idle' : ''}`} style={{color: 'var(--ink2)', lineHeight: 1.8}}>
            {response}
          </div>
        </div>
      </div>

      <div className="cg c3" style={{marginTop: 20}}>
        <div className="ai-box" style={{marginBottom:0, border: '1px solid var(--glass-border)'}}>
          <div className="ai-head" style={{padding: '8px 12px'}}>
            <div className="ai-title" style={{fontSize: 9}}><LineChart size={12} style={{marginRight: 4}} /> Drift Insight</div>
            <button className="btn" onClick={() => handleQuery(quickQueries.drift, setDriftResponse)} style={{fontSize: 9, padding: '2px 8px'}}>Sync</button>
          </div>
          <div className="ai-body" style={{minHeight:'100px', background: 'transparent'}}><div className="ai-out idle" style={{fontSize: 11}}>{driftResponse}</div></div>
        </div>
        
        <div className="ai-box" style={{marginBottom:0, border: '1px solid var(--glass-border)'}}>
          <div className="ai-head" style={{padding: '8px 12px'}}>
            <div className="ai-title" style={{fontSize: 9}}><BrainCircuit size={12} style={{marginRight: 4}} /> Model Logic</div>
            <button className="btn" onClick={() => handleQuery(quickQueries.model, setModelResponse)} style={{fontSize: 9, padding: '2px 8px'}}>Sync</button>
          </div>
          <div className="ai-body" style={{minHeight:'100px', background: 'transparent'}}><div className="ai-out idle" style={{fontSize: 11}}>{modelResponse}</div></div>
        </div>
        
        <div className="ai-box" style={{marginBottom:0, border: '1px solid var(--glass-border)'}}>
          <div className="ai-head" style={{padding: '8px 12px'}}>
            <div className="ai-title" style={{fontSize: 9}}><Lightbulb size={12} style={{marginRight: 4}} /> Strategy</div>
            <button className="btn" onClick={() => handleQuery(quickQueries.risk, setRiskResponse)} style={{fontSize: 9, padding: '2px 8px'}}>Sync</button>
          </div>
          <div className="ai-body" style={{minHeight:'100px', background: 'transparent'}}><div className="ai-out idle" style={{fontSize: 11}}>{riskResponse}</div></div>
        </div>
      </div>

      <div className="ai-box" style={{marginTop:'24px', border: '1px solid var(--glass-border)'}}>
        <div className="ai-head" style={{borderBottom: '1px solid var(--glass-border)'}}>
          <div className="ai-title" style={{display: 'flex', alignItems: 'center', gap: 8}}><Search size={14} /> Targeted Risk Query</div>
        </div>
        <div className="ai-body" style={{background: 'transparent'}}>
          <div style={{display:'flex', gap:'12px'}}>
            <input className="fi" style={{flex:1, fontSize:'13px'}} placeholder="Ask specific questions about the 549-record loan portfolio..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn fire" onClick={() => handleQuery(query, setResponse)} style={{display: 'flex', alignItems: 'center', gap: 6}}><Sparkles size={12} /> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
