const BACKEND_URL='http://localhost:8000';
setInterval(()=>{document.getElementById('tsDisplay').textContent=new Date().toLocaleTimeString()},1000);

function switchTab(name,navEl,tabEl){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  document.getElementById('pageName').textContent=name.charAt(0).toUpperCase()+name.slice(1);
  if(navEl)navEl.classList.add('active');
  if(tabEl)tabEl.classList.add('active');
  initCharts(name);
}

// ── STATIC DATA ──
const SCATTER=[
  {x:8.0,y:36.0,s:'A'},{x:6.0,y:50.0,s:'A'},{x:4.8,y:15.0,s:'A'},{x:25.0,y:55.2,s:'A'},
  {x:24.0,y:150.0,s:'A'},{x:3.0,y:93.0,s:'A'},{x:20.0,y:60.0,s:'A'},{x:24.3,y:113.2,s:'A'},
  {x:9.0,y:63.0,s:'A'},{x:6.0,y:65.0,s:'A'},{x:25.0,y:190.0,s:'A'},{x:11.0,y:158.0,s:'A'},
  {x:25.0,y:204.0,s:'A'},{x:20.0,y:43.7,s:'A'},{x:8.0,y:30.0,s:'A'},{x:10.0,y:31.0,s:'A'},
  {x:23.6,y:47.2,s:'A'},{x:10.0,y:86.0,s:'A'},{x:9.6,y:125.0,s:'A'},{x:5.0,y:110.0,s:'A'},
  {x:7.0,y:74.8,s:'R'},{x:21.5,y:140.0,s:'R'},{x:2.2,y:45.5,s:'R'},{x:1.8,y:50.0,s:'R'},
  {x:15.0,y:90.0,s:'R'},{x:7.0,y:48.0,s:'R'},{x:32.0,y:75.0,s:'R'},{x:19.0,y:34.0,s:'R'},
  {x:4.5,y:57.0,s:'R'},{x:25.0,y:76.0,s:'R'},{x:14.5,y:39.0,s:'R'},{x:8.0,y:64.0,s:'R'},
  {x:1.5,y:24.0,s:'R'},{x:8.2,y:150.0,s:'R'},{x:3.2,y:95.0,s:'R'},{x:9.1,y:49.2,s:'R'},
  {x:14.1,y:36.5,s:'R'},{x:12.0,y:50.6,s:'R'},{x:2.5,y:60.0,s:'R'},{x:20.0,y:65.0,s:'R'}
];
const LOGS=[
  {loan:8000,income:36000,dti:0.47,score:600,rate:7.2,tenure:160,status:'Approved',purpose:'moving',grade:'E',risk:54.2},
  {loan:6000,income:50000,dti:0.0,score:700,rate:16.8,tenure:187,status:'Approved',purpose:'small_business',grade:'C',risk:0.04},
  {loan:4800,income:15000,dti:0.0,score:750,rate:19.5,tenure:57,status:'Approved',purpose:'debt_consolidation',grade:'B',risk:-19.9},
  {loan:25000,income:55164,dti:0.0,score:700,rate:14.3,tenure:171,status:'Approved',purpose:'house',grade:'C',risk:0.14},
  {loan:24000,income:150000,dti:0.22,score:750,rate:17.5,tenure:63,status:'Approved',purpose:'debt_consolidation',grade:'B',risk:-13.4},
  {loan:3000,income:93000,dti:0.0,score:800,rate:18.6,tenure:353,status:'Approved',purpose:'home_improvement',grade:'A',risk:-40.0},
  {loan:20000,income:60000,dti:0.0,score:700,rate:17.7,tenure:239,status:'Approved',purpose:'house',grade:'C',risk:0.10},
  {loan:24250,income:113200,dti:0.28,score:750,rate:14.1,tenure:112,status:'Approved',purpose:'other',grade:'B',risk:-11.5},
  {loan:9000,income:63000,dti:0.29,score:800,rate:19.2,tenure:86,status:'Approved',purpose:'wedding',grade:'A',risk:-31.3},
  {loan:10000,income:86000,dti:0.0,score:750,rate:16.5,tenure:64,status:'Approved',purpose:'major_purchase',grade:'B',risk:-20.0},
  {loan:7000,income:74760,dti:7.99,score:750,rate:8.3,tenure:291,status:'Rejected',purpose:'car',grade:'B',risk:219.7},
  {loan:21500,income:140000,dti:24.2,score:750,rate:7.4,tenure:125,status:'Rejected',purpose:'debt_consolidation',grade:'B',risk:706.0},
  {loan:2200,income:45500,dti:12.58,score:650,rate:12.2,tenure:125,status:'Rejected',purpose:'other',grade:'D',risk:397.4},
  {loan:1800,income:50004,dti:18.93,score:750,rate:10.8,tenure:333,status:'Rejected',purpose:'other',grade:'B',risk:547.9},
  {loan:15000,income:90000,dti:17.85,score:750,rate:11.5,tenure:108,status:'Rejected',purpose:'debt_consolidation',grade:'B',risk:515.6},
  {loan:7000,income:48000,dti:10.35,score:800,rate:19.3,tenure:253,status:'Rejected',purpose:'house',grade:'A',risk:270.5},
  {loan:32000,income:75000,dti:13.97,score:550,rate:18.3,tenure:236,status:'Rejected',purpose:'credit_card',grade:'F',risk:479.2},
  {loan:19000,income:34000,dti:17.44,score:750,rate:12.5,tenure:18,status:'Rejected',purpose:'debt_consolidation',grade:'B',risk:503.4},
  {loan:4500,income:57000,dti:18.67,score:800,rate:13.2,tenure:170,status:'Rejected',purpose:'medical',grade:'A',risk:520.1},
  {loan:25000,income:76000,dti:19.25,score:550,rate:17.0,tenure:349,status:'Rejected',purpose:'credit_card',grade:'F',risk:637.6},
];
const tbody=document.getElementById('logTableBody');
LOGS.forEach(r=>{
  const isApp=r.status==='Approved';
  const rc=r.risk>100?'rhigh':r.risk>0?'rmed':'rlow';
  const gb={'A':'bg','B':'bb','C':'bv','D':'ba','E':'ba','F':'br','G':'br'}[r.grade]||'bm';
  tbody.innerHTML+=`<tr><td>₹${r.loan.toLocaleString()}</td><td>₹${r.income.toLocaleString()}</td><td>${r.dti}%</td><td>${r.score}</td><td>${r.rate}%</td><td>${r.tenure}m</td><td><span class="badge ${gb}">${r.grade}</span></td><td>${r.purpose}</td><td class="${isApp?'dapp':'drej'}">${isApp?'✓ APPROVED':'✗ REJECTED'}</td><td class="${rc}">${r.risk.toFixed(1)}</td></tr>`;
});

// ── PREDICT + LOG SAVE ──
const SAMPLES=[[8000,36000,0.47,7.2,3,600],[6000,50000,0,16.8,4,700],[25000,55164,0,14.3,10,700],[9000,63000,0.29,19.2,1,800],[20000,60000,0,17.7,8,700],[10000,70000,2.5,12.0,5,730],[7000,48000,10.35,19.3,10,800],[15000,90000,17.85,11.5,9,750]];
let predCount=0;
const sessionLogs=[];

function loadRandom(){const s=SAMPLES[Math.floor(Math.random()*SAMPLES.length)];['p_loan','p_inc','p_dti','p_rate','p_acc','p_revol'].forEach((id,i)=>document.getElementById(id).value=s[i]);}

async function runPredict(){
  const loan=+document.getElementById('p_loan').value;
  const inc=+document.getElementById('p_inc').value;
  const dti=+document.getElementById('p_dti').value;
  const rate=+document.getElementById('p_rate').value;
  const acc=+document.getElementById('p_acc').value;
  const score=+document.getElementById('p_revol').value;

  const ts=new Date();
  const btn = document.querySelector('button[onclick="runPredict()"]');
  const orgText = btn.textContent;
  
  // 1. Loading Indicator
  btn.disabled = true;
  btn.textContent = '⟳ Processing...';
  document.getElementById('predResult').style.display='none'; // Hide past results

  let savedToBackend=false;
  let decision = 'UNKNOWN';
  let risk = 'UNKNOWN';
  let factor = 'API Call Failed';
  let rej = false;

  // 2. Fetch from Backend (Send data via AJAX / fetch)
  try{
    const resp=await fetch(BACKEND_URL+'/predict',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({loan_amnt:loan,annual_inc:inc,dti,int_rate:rate,experience:acc,credit_score:score})
    });
    
    if(!resp.ok){
      throw new Error(`API Error: HTTP ${resp.status}`);
    }

    // 3. Handle API Responses Dynamically
    const data = await resp.json();
    savedToBackend = true;
    
    decision = data.decision || 'APPROVED';
    rej = decision === 'REJECTED';
    risk = data.risk_level || (rej ? 'HIGH' : 'LOW');
    factor = data.key_factor || `DTI: ${dti}%, Credit: ${score}`;

  } catch(e) {
    // 4. Proper error handling
    console.error("Backend Error:", e);
    alert("Failed to reach backend API. Ensure server.py is running. Error: " + e.message);
    btn.disabled = false;
    btn.textContent = orgText;
    return; // Stop execution on error
  }

  // Restore button state
  btn.disabled = false;
  btn.textContent = orgText;

  // 5. Display Prediction Results Dynamically (No reload)
  const el=document.getElementById('predResult');
  el.style.display='flex';
  
  document.getElementById('predDecision').textContent=rej?'✗':'✓';
  document.getElementById('predDecision').className='pred-dec '+(rej?'no':'ok');
  document.getElementById('predLabel').textContent=decision;
  document.getElementById('predRisk').textContent=risk;
  document.getElementById('predFactor').textContent=factor;
  
  const statusEl=document.getElementById('predLogStatus');
  statusEl.textContent='✓ Saved to loan_audit.db (via POST /predict)';
  statusEl.style.color='var(--pine)';

  // Update session logs table
  const logEntry={
    num:++predCount,time:ts.toLocaleTimeString(),loan,income:inc,dti,score,rate,
    decision,risk,factor,saved:savedToBackend
  };
  sessionLogs.unshift(logEntry);
  updatePredLogTable();
}

function updatePredLogTable(){
  const count=sessionLogs.length;
  document.getElementById('predLogCount').textContent=count+' prediction'+(count!==1?'s':'')+' logged this session';
  if(count===0){document.getElementById('predLogEmpty').style.display='block';document.getElementById('predLogTbl').style.display='none';return;}
  document.getElementById('predLogEmpty').style.display='none';
  document.getElementById('predLogTbl').style.display='table';
  const tbody2=document.getElementById('predLogBody');
  tbody2.innerHTML='';
  sessionLogs.forEach(r=>{
    const isApp=r.decision==='APPROVED';
    const rc=r.risk==='HIGH'?'rhigh':r.risk==='MEDIUM'?'rmed':'rlow';
    const saved=r.saved?'<span style="color:var(--pine);font-weight:700">✓ DB</span>':'<span style="color:var(--fire3)">⚡ Local</span>';
    tbody2.innerHTML+=`<tr>
      <td>${r.num}</td><td>${r.time}</td>
      <td>₹${r.loan.toLocaleString()}</td>
      <td>₹${r.income.toLocaleString()}</td>
      <td>${r.dti}%</td><td>${r.score}</td><td>${r.rate}%</td>
      <td class="${isApp?'dapp':'drej'}">${isApp?'✓ APPROVED':'✗ REJECTED'}</td>
      <td class="${rc}">${r.risk}</td>
      <td style="font-size:10px">${r.factor} ${saved}</td>
    </tr>`;
  });
}
function clearPredLogs(){sessionLogs.length=0;predCount=0;updatePredLogTable();}

// ── BACKEND SIM ──
const SIMLOGS=[['INFO','server.py','Loading data.csv (549 records)'],['INFO','preprocessing.py','Encoding CreditGrade A–G, HomeOwnership, LoanPurpose'],['INFO','preprocessing.py','Scaling with StandardScaler'],['OK','trainer.py','RF: 0.8000 · LR: 0.8250 ★ · DT: 0.7500'],['MODEL','trainer.py','Saved → models/model.pkl'],['INFO','api.py','FastAPI ready at http://localhost:8000'],['INFO','api.py','Listening for POST /predict...'],['OK','api.py','POST /predict ← loan=₹10,000 DTI=2.5% score=730'],['OK','predictor.py','Decision: APPROVED · Risk: LOW'],['OK','logger.py','✓ Written to loan_audit.db (row #1) ← ONLY /predict logs'],['OK','api.py','POST /predict ← loan=₹7,000 DTI=7.99% score=750'],['OK','predictor.py','Decision: REJECTED · Risk: HIGH'],['OK','logger.py','✓ Written to loan_audit.db (row #2)'],['WARN','audit.py','Drift: 0.14 approaching threshold 0.15'],['OK','audit.py','Bias: 0.02 — within bounds']];
let simR=false;
function clearLog(){document.getElementById('logStream').innerHTML='';}
function addLine(h){const d=document.getElementById('logStream');d.innerHTML+=`<div class="ll">${h}</div>`;d.scrollTop=d.scrollHeight;}
async function runBackendSim(){
  if(simR)return;simR=true;clearLog();
  for(let i=0;i<SIMLOGS.length;i++){
    const[lvl,mod,msg]=SIMLOGS[i];
    const cls=lvl==='OK'?'lok':lvl==='WARN'?'lw':lvl==='MODEL'?'lm':'li';
    const ts=new Date();ts.setSeconds(ts.getSeconds()-(SIMLOGS.length-i));
    addLine(`<span class="lt">[${ts.toLocaleTimeString()}]</span> <span class="${cls}">${lvl.padEnd(5)}</span> ${mod} · ${msg}`);
    await new Promise(r=>setTimeout(r,110+Math.random()*180));
  }simR=false;
}

// ── SQL SIM ──
const SQL={count:'→ 549 rows · avg_loan: ₹10,496 · avg_dti: 4.93%',approved:'→ Approved: 357 (65.0%) · Rejected: 192 (35.0%)',dti:'→ <5%: 377 · 5-15%: 87 · 15-25%: 79 · 25%+: 6',grade:'→ A:180 · B:166 · C:94 · D:63 · E:35 · F:7 · G:4',purpose:'→ debt_consolidation:146 · other:77 · home_improvement:73 · small_business:52 · major_purchase:49'};
function runSQL(){const v=document.getElementById('sqlQuery').value;document.getElementById('sqlResult').innerHTML=`<div class="ll"><span class="lok">→</span> ${SQL[v]}</div>`;}

// ── AI ──
const SYS='You are a senior quantitative risk analyst. Real data.csv stats: 549 records, 65% approval (357/192). Avg loan ₹10,496. Avg income ₹96,752. Avg DTI 4.93% (approved 0.19% vs rejected 13.75%). Avg credit 732. Avg rate 13.59%. LR 82.5% (best), RF 80%, DT 75%. Drift 0.14 (threshold 0.15). Bias 0.02. Grades: A=180,B=166,C=94,D=63,E=35,F=7,G=4. Logging only on POST /predict. Be concise and expert.';
async function callAI(msg,el){
  el.className='ai-out idle';el.textContent='⟳ Querying Groq via backend...';
  try{
    const r=await fetch(BACKEND_URL+'/ai/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:SYS,message:msg})});
    if(!r.ok){const e=await r.json().catch(()=>({}));el.className='ai-out idle';el.textContent='⚠ Backend error: '+(e.detail||r.statusText);return;}
    const d=await r.json();el.className='ai-out';el.textContent=d.result||JSON.stringify(d);
  }catch(e){el.className='ai-out idle';el.textContent='⚠ Backend offline at '+BACKEND_URL+'\n\nRun: python server.py\n\nError: '+e.message;}
}
function runAIAnalysis(){
  const el=document.getElementById('aiOut'),btn=document.getElementById('aiBtn');
  btn.disabled=true;btn.textContent='⟳ Analyzing...';
  callAI('Comprehensive risk assessment: 1) 65% approval with DTI divergence (approved 0.19% vs rejected 13.75%). 2) Drift 0.14 root cause. 3) Grade A/B concentration (346/549). 4) LR dominance. 5) Top 3 actions.',el).finally(()=>{btn.disabled=false;btn.textContent='▶ Analyze Portfolio';});
}
const AIQ={drift:'Why is drift 0.14? Approved avg DTI 0.19% vs rejected 13.75% — what does this divergence signal?',model:'Why does LR (82.5%) beat RF (80%) on this dataset? What does credit_score at 32% feature importance mean?',risk:'3 concrete actions: 65% approval, 192 rejections (avg DTI 13.75%), drift 0.14 near threshold. Be specific.'};
function runAIQuery(t){callAI(AIQ[t],document.getElementById('ai'+t.charAt(0).toUpperCase()+t.slice(1)));}
function runCustomQuery(){const q=document.getElementById('aiQuery').value.trim();if(!q)return;callAI(q,document.getElementById('aiCustom'));}

async function refreshKPIs(){
  try{
    const r=await fetch(BACKEND_URL+'/logs?limit=1000');if(!r.ok)return;
    const d=await r.json();const logs=d.logs||[];if(!logs.length)return;
    const total=logs.length,approved=logs.filter(x=>x.decision==='APPROVED').length;
    document.getElementById('kpiTotal').textContent=total;
    document.querySelector('.kpi-grid .kpi:nth-child(1) .k-sub').innerHTML=`<span class="up">↑ ${approved}</span> approved`;
    document.querySelector('.kpi-grid .kpi:nth-child(2) .k-val').textContent=Math.round(approved/total*100)+'%';
    document.querySelector('.kpi-grid .kpi:nth-child(2) .k-sub').textContent=`${approved} app · ${total-approved} rej`;
  }catch(e){}
}

// ── CHARTS ──
Chart.defaults.color='#4a4540';
Chart.defaults.font.family='"Space Mono",monospace';
Chart.defaults.font.size=10;
Chart.defaults.plugins.legend.display=false;
const GR={color:'rgba(15,13,10,.07)',drawBorder:false};
const AX={x:{grid:GR,ticks:{color:'#4a4540'}},y:{grid:GR,ticks:{color:'#4a4540'}}};
const W={};const INIT={};
function mk(id,cfg){const el=document.getElementById(id);if(!el)return;W[id]=new Chart(el,cfg);}
function initCharts(tab){
  if(INIT[tab])return;INIT[tab]=true;
  if(tab==='overview'){
    mk('c-volume',{type:'bar',data:{labels:['Batch 1','Batch 2','Batch 3','Batch 4'],datasets:[{data:[138,137,137,137],backgroundColor:['#e85d0440','#e85d0430','#e85d0422','#e85d0415'],borderColor:['#e85d04','#e85d0490','#e85d0455','#e85d0430'],borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:AX}});
    mk('c-loan-donut',{type:'doughnut',data:{labels:['<₹5k','₹5-12k','₹12-22k','>₹22k'],datasets:[{data:[120,243,129,57],backgroundColor:['#1a6b4528','#1a4fa028','#e85d0425','#f0a40028'],borderColor:['#1a6b45','#1a4fa0','#e85d04','#f0a400'],borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:true,position:'right',labels:{color:'#4a4540',font:{size:9.5},padding:8,boxWidth:8}}}}});
    mk('c-income',{type:'bar',data:{labels:['<₹40k','₹40-80k','₹80-150k','>₹150k'],datasets:[{data:[133,231,137,48],backgroundColor:'#1a4fa022',borderColor:'#1a4fa0',borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:AX}});
    mk('c-dti',{type:'bar',data:{labels:['<5%','5-15%','15-25%','25%+'],datasets:[{data:[377,87,79,6],backgroundColor:['#1a6b4522','#f0a40025','#e85d0425','#dc2f0228'],borderColor:['#1a6b45','#f0a400','#e85d04','#dc2f02'],borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:AX}});
    mk('c-rate',{type:'bar',data:{labels:['<10%','10-14%','14-18%','>18%'],datasets:[{data:[120,185,158,86],backgroundColor:['#1a6b4520','#1a6b4528','#f0a40020','#dc2f0222'],borderColor:['#1a6b45','#1a6b45','#f0a400','#dc2f02'],borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:AX}});
  }
  if(tab==='backend'){
    mk('c-features',{type:'bar',data:{labels:['credit_score','dti','loan_amnt','annual_inc','int_rate','experience'],datasets:[{data:[32,24,18,13,8,5],backgroundColor:['#e85d0430','#1a4fa028','#1a6b4525','#f0a40025','#e85d0420','#dc2f0220'],borderColor:['#e85d04','#1a4fa0','#1a6b45','#f0a400','#e85d04','#dc2f02'],borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',scales:{x:{grid:GR,ticks:{color:'#4a4540'},title:{display:true,text:'Importance (%)',color:'#4a4540',font:{size:9}}},y:{grid:GR,ticks:{color:'#2a2520',font:{size:10.5}}}}}});
  }
  if(tab==='predict'){
    const ap=SCATTER.filter(d=>d.s==='A').map(d=>({x:d.x,y:d.y}));
    const rj=SCATTER.filter(d=>d.s==='R').map(d=>({x:d.x,y:d.y}));
    mk('c-scatter',{type:'scatter',data:{datasets:[{data:ap,backgroundColor:'#1a6b4548',borderColor:'#1a6b45',borderWidth:1.5,pointRadius:5,pointHoverRadius:7},{data:rj,backgroundColor:'#dc2f0240',borderColor:'#dc2f02',borderWidth:1.5,pointRadius:5,pointHoverRadius:7}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:GR,ticks:{color:'#4a4540'},title:{display:true,text:'Loan Amount (₹k)',color:'#4a4540',font:{size:9}}},y:{grid:GR,ticks:{color:'#4a4540'},title:{display:true,text:'Annual Income (₹k)',color:'#4a4540',font:{size:9}}}}}});
    mk('c-grade',{type:'bar',data:{labels:['A','B','C','D','E','F','G'],datasets:[{data:[180,166,94,63,35,7,4],backgroundColor:['#1a6b4530','#1a4fa030','#2a252528','#f0a40030','#e85d0428','#dc2f0235','#dc2f0245'],borderColor:['#1a6b45','#1a4fa0','#4a4540','#f0a400','#e85d04','#dc2f02','#dc2f02'],borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:GR,ticks:{color:'#4a4540'}},y:{grid:GR,ticks:{color:'#4a4540'}}}}});
  }
  if(tab==='audit'){
    mk('c-drift-time',{type:'line',data:{labels:['Batch 1','Batch 2','Batch 3','Batch 4','Current'],datasets:[{data:[0.04,0.08,0.13,0.19,0.14],borderColor:'#e85d04',backgroundColor:'#e85d0412',fill:true,tension:.4,pointRadius:5,pointBackgroundColor:'#e85d04'},{data:[0.15,0.15,0.15,0.15,0.15],borderColor:'#dc2f0250',borderDash:[4,4],pointRadius:0,fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:GR,ticks:{color:'#4a4540'}},y:{grid:GR,ticks:{color:'#4a4540'},min:0,max:0.25}}}});
    mk('c-shift',{type:'bar',data:{labels:['Avg Loan (₹k)','Avg DTI (%)','Avg Rate (%)'],datasets:[{label:'First 275',data:[10.2,4.9,13.2],backgroundColor:'#1a4fa022',borderColor:'#1a4fa0',borderWidth:1.5,borderRadius:3},{label:'Last 274',data:[10.8,5.0,14.0],backgroundColor:'#e85d0422',borderColor:'#e85d04',borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,labels:{color:'#4a4540',font:{size:9.5},boxWidth:10}}},scales:{x:{grid:GR,ticks:{color:'#4a4540'}},y:{grid:GR,ticks:{color:'#4a4540'}}}}});
  }
  if(tab==='data'){
    mk('c-revol',{type:'bar',data:{labels:['<600','600-700','700-780','780+'],datasets:[{data:[11,98,260,180],backgroundColor:'#2a252522',borderColor:'#2a2520',borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{...AX.x,title:{display:true,text:'Credit Score Band',color:'#4a4540',font:{size:9}}},y:AX.y}}});
    mk('c-purpose',{type:'bar',data:{labels:['debt_consol.','other','home_imprv.','small_biz','major_purch.','credit_card','medical','wedding'],datasets:[{data:[146,77,73,52,49,42,20,17],backgroundColor:'#1a4fa020',borderColor:'#1a4fa0',borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',scales:{x:{grid:GR,ticks:{color:'#4a4540'}},y:{grid:GR,ticks:{color:'#2a2520',font:{size:9.5}}}}}});
  }
}

window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('tsDisplay').textContent=new Date().toLocaleTimeString();
  initCharts('overview');
  refreshKPIs();
});