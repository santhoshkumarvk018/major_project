import React, { useState } from 'react';
import { analyzeAI } from '../utils/api';

const AIAnalysis = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Enter a question above.');
  const [loading, setLoading] = useState(false);
  const [driftResponse, setDriftResponse] = useState('Why is drift 0.14?');
  const [modelResponse, setModelResponse] = useState('Why does LR beat RF?');
  const [riskResponse, setRiskResponse] = useState('Portfolio improvements');

  const systemPrompt = 'You are a senior quantitative risk analyst. Real data.csv stats: 549 records, 65% approval (357/192). Avg loan ₹10,496. Avg income ₹96,752. Avg DTI 4.93% (approved 0.19% vs rejected 13.75%). Avg credit 732. Avg rate 13.59%. LR 82.5% (best), RF 80%, DT 75%. Drift 0.14 (threshold 0.15). Bias 0.02. Grades: A=180,B=166,C=94,D=63,E=35,F=7,G=4. Logging only on POST /predict. Be concise and expert.';

  const handleQuery = async (msg, setter) => {
    setter('⟳ Querying Groq via backend...');
    try {
      const data = await analyzeAI(msg, systemPrompt);
      setter(data.result);
    } catch (error) {
      setter('⚠ Error: ' + error.message);
    }
  };

  const runFullAnalysis = () => {
    setLoading(true);
    setResponse('⟳ Analyzing portfolio...');
    handleQuery('Comprehensive risk assessment: 1) 65% approval with DTI divergence. 2) Drift 0.14 root cause. 3) Grade A/B concentration. 4) LR dominance. 5) Top 3 actions.', setResponse)
      .finally(() => setLoading(false));
  };

  const quickQueries = {
    drift: 'Why is drift 0.14? Approved avg DTI 0.19% vs rejected 13.75% — what does this divergence signal?',
    model: 'Why does LR (82.5%) beat RF (80%) on this dataset? What does credit_score at 32% feature importance mean?',
    risk: '3 concrete actions: 65% approval, 192 rejections (avg DTI 13.75%), drift 0.14 near threshold. Be specific.'
  };

  return (
    <div className="tab-panel active">
      <div className="sh"><div className="sh-lbl">AI-Powered Portfolio Analysis</div><div className="sh-btn" onClick={runFullAnalysis}>Run Full ↗</div></div>
      <div className="notice pine">✓ Groq Free Tier (llama-3.1-8b) · Key lives in server.py only · Run <code>python server.py</code> first</div>
      
      <div className="ai-box">
        <div className="ai-head"><div className="ai-title">PORTFOLIO RISK ANALYST — llama-3.1-8b via Groq Free</div><button className="btn fire" onClick={runFullAnalysis} disabled={loading}>▶ Analyze Portfolio</button></div>
        <div className="ai-body"><div className={`ai-out ${response === 'Enter a question above.' ? 'idle' : ''}`}>{response}</div></div>
      </div>

      <div className="cg c3">
        <div className="ai-box" style={{marginBottom:0}}><div className="ai-head"><div className="ai-title">DRIFT EXPLAINER</div><button className="btn" onClick={() => handleQuery(quickQueries.drift, setDriftResponse)} style={{fontSize:'9px', padding:'2px 8px'}}>Ask ↗</button></div><div className="ai-body" style={{minHeight:'80px'}}><div className="ai-out idle" style={{fontSize:'10.5px'}}>{driftResponse}</div></div></div>
        <div className="ai-box" style={{marginBottom:0}}><div className="ai-head"><div className="ai-title">MODEL COMPARISON</div><button className="btn" onClick={() => handleQuery(quickQueries.model, setModelResponse)} style={{fontSize:'9px', padding:'2px 8px'}}>Ask ↗</button></div><div className="ai-body" style={{minHeight:'80px'}}><div className="ai-out idle" style={{fontSize:'10.5px'}}>{modelResponse}</div></div></div>
        <div className="ai-box" style={{marginBottom:0}}><div className="ai-head"><div className="ai-title">RISK RECS</div><button className="btn" onClick={() => handleQuery(quickQueries.risk, setRiskResponse)} style={{fontSize:'9px', padding:'2px 8px'}}>Ask ↗</button></div><div className="ai-body" style={{minHeight:'80px'}}><div className="ai-out idle" style={{fontSize:'10.5px'}}>{riskResponse}</div></div></div>
      </div>

      <div className="ai-box" style={{marginTop:'12px'}}>
        <div className="ai-head"><div className="ai-title">CUSTOM QUERY</div></div>
        <div className="ai-body">
          <div style={{display:'flex', gap:'8px', marginBottom:'10px'}}>
            <input className="fi" style={{flex:1, fontSize:'11.5px', padding:'7px 10px'}} placeholder="Ask anything about the 549-record loan portfolio..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn fire" onClick={() => handleQuery(query, setResponse)}>Send ↗</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
