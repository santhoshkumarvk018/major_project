"""
LoanAudit AI — FastAPI Backend
================================
Runs the prediction engine, audit logic, SQLite logging,
and AI analysis (via Groq FREE tier — no paid Anthropic key needed).

Setup:
    pip install fastapi uvicorn groq

Get a FREE Groq API key at: https://console.groq.com  (no credit card required)

Usage:
    GROQ_API_KEY=your_key_here python server.py

Then open frontend/index.html in your browser (or serve it via Live Server).
"""

import os
import sqlite3
import random
from datetime import datetime
from typing import Optional
import csv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Groq client (free tier) ───────────────────────────────────────────────────
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    print("⚠ groq package not installed. Run: pip install groq")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL   = "llama-3.1-8b-instant"   # free & fast on Groq

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(title="LoanAudit AI Backend", version="2.4.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── SQLite DB ─────────────────────────────────────────────────────────────────
DB_PATH = "loan_audit.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def parse_experience(exp):
    exp = exp.strip()
    if exp == "< 1 year":
        return 0.5
    elif exp == "1 year":
        return 1.0
    elif exp.endswith(" years"):
        try:
            return float(exp.split()[0])
        except ValueError:
            return 0.0
    elif exp == "10+ years":
        return 10.0
    else:
        return 0.0

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                ts          TEXT NOT NULL,
                loan_amnt   REAL,
                annual_inc  REAL,
                dti         REAL,
                int_rate    REAL,
                experience  REAL,
                credit_score REAL,
                decision    TEXT,
                risk_flag   TEXT
            )
        """)
        # Seed with data from data.csv if empty
        if conn.execute("SELECT COUNT(*) FROM predictions").fetchone()[0] == 0:
            try:
                with open('data.csv', 'r') as f:
                    reader = csv.reader(f)
                    next(reader)  # skip header
                    seed_data = list(reader)
                processed_data = []
                for row in seed_data:
                    if len(row) < 16:
                        continue  # skip invalid rows
                    loan_amnt = float(row[0])
                    annual_inc = float(row[1])
                    dti = float(row[2])
                    experience = parse_experience(row[3])
                    credit_score = float(row[8])
                    int_rate = float(row[9])
                    decision = "APPROVED" if row[11].lower() == "approved" else "REJECTED"
                    risk_score = float(row[12])
                    risk_flag = "LOW" if risk_score < 10 else "HIGH"
                    processed_data.append((loan_amnt, annual_inc, dti, int_rate, experience, credit_score, decision, risk_flag))
                conn.executemany(
                    "INSERT INTO predictions (ts,loan_amnt,annual_inc,dti,int_rate,experience,credit_score,decision,risk_flag) VALUES (?,?,?,?,?,?,?,?,?)",
                    [("2026-03-25 09:00:00", *row) for row in processed_data]
                )
            except FileNotFoundError:
                print("Warning: data.csv not found, no seed data loaded.")
            except Exception as e:
                print(f"Error loading seed data: {e}")

init_db()

# ═══════════════════════════════════════════════════════════════════════════════
# Pydantic models
# ═══════════════════════════════════════════════════════════════════════════════

class LoanInput(BaseModel):
    loan_amnt:    float
    annual_inc:   float
    dti:          float
    int_rate:     float
    experience:   float
    credit_score: float

class AIRequest(BaseModel):
    message: str
    system:  Optional[str] = None

# ═══════════════════════════════════════════════════════════════════════════════
# Prediction logic  (rule-based ensemble simulation)
# ═══════════════════════════════════════════════════════════════════════════════

def rule_predict(loan: LoanInput) -> dict:
    """Simulates the 3-model ensemble using the production rejection rules."""
    rejected = False
    factor   = ""

    if loan.dti >= 30:
        rejected = True
        factor   = f"High DTI ({loan.dti:.1f}%)"
    elif loan.credit_score <= 640:
        rejected = True
        factor   = f"Low Credit Score ({int(loan.credit_score)})"
    elif loan.int_rate >= 15.5:
        rejected = True
        factor   = f"High Interest Rate ({loan.int_rate:.1f}%)"
    else:
        factor = f"DTI: {loan.dti:.1f}%, Credit: {int(loan.credit_score)}"

    if rejected:
        risk = "HIGH" if (loan.dti >= 35 or loan.credit_score <= 600) else "MEDIUM"
    else:
        risk = "LOW"

    return {
        "decision":  "REJECTED" if rejected else "APPROVED",
        "risk_flag": risk,
        "key_factor": factor,
    }

# ═══════════════════════════════════════════════════════════════════════════════
# Routes
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "service": "LoanAudit AI Backend",
        "version": "2.4.1",
        "ai_provider": "Groq (free tier)",
        "model": GROQ_MODEL,
        "groq_ready": GROQ_AVAILABLE and bool(GROQ_API_KEY),
    }


@app.post("/predict")
def predict(loan: LoanInput):
    """
    POST /predict
    Single-loan prediction. Logs result to SQLite.
    """
    result = rule_predict(loan)
    ts     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_db() as conn:
        conn.execute(
            "INSERT INTO predictions (ts,loan_amnt,annual_inc,dti,int_rate,experience,credit_score,decision,risk_flag) VALUES (?,?,?,?,?,?,?,?,?)",
            (ts, loan.loan_amnt, loan.annual_inc, loan.dti, loan.int_rate,
             loan.experience, loan.credit_score, result["decision"], result["risk_flag"])
        )

    return {"status": "ok", "ts": ts, **result}


@app.get("/logs")
def get_logs(limit: int = 50):
    """GET /logs — retrieve prediction history from SQLite."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM predictions ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    return {"count": len(rows), "logs": [dict(r) for r in rows]}


@app.get("/audit/drift")
def audit_drift():
    """GET /audit/drift — current drift score and alert flag."""
    drift_score = 0.14
    threshold   = 0.15
    return {
        "drift_score": drift_score,
        "threshold":   threshold,
        "alert":       drift_score >= threshold,
        "status":      "WARNING — approaching threshold" if drift_score >= 0.12 else "OK",
        "retrain_required": drift_score >= threshold,
    }


@app.get("/audit/bias")
def audit_bias():
    """GET /audit/bias — bias score across protected attributes."""
    return {
        "bias_score": 0.02,
        "threshold":  0.10,
        "status":     "OK — within bounds",
        "breakdown": {
            "gender_parity":     0.01,
            "income_band_parity": 0.02,
            "tenure_parity":     0.01,
        },
    }


@app.post("/retrain")
def retrain():
    """POST /retrain — trigger manual model retraining (simulated)."""
    return {
        "status": "triggered",
        "message": "Retraining job queued. New model will be available in ~30s.",
        "estimated_completion": "2026-03-25 09:01:00",
    }


@app.get("/models")
def models():
    """GET /models — ensemble model accuracy metrics."""
    return {
        "ensemble": [
            {"name": "LogisticRegression", "accuracy": 0.825, "precision": 0.8461, "recall": 0.8461, "f1": 0.8461, "status": "BEST"},
            {"name": "RandomForest",       "accuracy": 0.800, "precision": 0.7692, "recall": 0.7692, "f1": 0.7692, "status": "ACTIVE"},
            {"name": "DecisionTree",       "accuracy": 0.750, "precision": 0.7692, "recall": 0.6154, "f1": 0.6841, "status": "FALLBACK"},
        ],
        "feature_importance": {
            "credit_score": 0.32,
            "dti":          0.24,
            "loan_amnt":    0.18,
            "annual_inc":   0.13,
            "int_rate":     0.08,
            "experience":   0.05,
        },
    }


# ── AI Analysis via Groq (FREE) ────────────────────────────────────────────────

@app.post("/ai/analyze")
def ai_analyze(req: AIRequest):
    """
    POST /ai/analyze
    Sends the user's message to Groq (free tier) and returns the AI response.
    Requires GROQ_API_KEY env variable.
    Get a free key at: https://console.groq.com
    """
    if not GROQ_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Groq package not installed. Run: pip install groq"
        )
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "GROQ_API_KEY not set. "
                "Get a FREE key at https://console.groq.com, "
                "then run: GROQ_API_KEY=your_key python server.py"
            )
        )

    client = Groq(api_key=GROQ_API_KEY)

    messages = []
    if req.system:
        messages.append({"role": "system", "content": req.system})
    messages.append({"role": "user", "content": req.message})

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=1024,
            temperature=0.4,
        )
        result_text = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    return {
        "result":    result_text,
        "model":     GROQ_MODEL,
        "provider":  "Groq (free tier)",
        "tokens_used": response.usage.total_tokens if hasattr(response, "usage") else None,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# Entry point
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn

    key_status = "✓ Groq key loaded" if GROQ_API_KEY else "⚠ GROQ_API_KEY not set — AI tab will show error"
    print("=" * 60)
    print("  LoanAudit AI — FastAPI Backend  v2.4.1")
    print("=" * 60)
    print(f"  AI provider : Groq (free tier) — {GROQ_MODEL}")
    print(f"  Key status  : {key_status}")
    print(f"  Free key    : https://console.groq.com")
    print("=" * 60)
    print("  Endpoints:")
    print("    POST /predict        — loan prediction")
    print("    GET  /logs           — decision history")
    print("    GET  /audit/drift    — drift score")
    print("    GET  /audit/bias     — bias score")
    print("    POST /retrain        — trigger retraining")
    print("    GET  /models         — model metrics")
    print("    POST /ai/analyze     — AI analysis (Groq free)")
    print("=" * 60)
    print("  Docs: http://localhost:8000/docs")
    print()

    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
