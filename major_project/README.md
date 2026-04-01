# LoanAudit AI — Smart Governance & Prediction

A professional AI decision audit and risk intelligence monitoring system. Features a **FatAPI** backend and a **React/Vite** frontend with a premium glassmorphic interface.

---

## 🏗️ Project Structure

```
major_project/
├── frontend/          # React + Vite (UI)
└── backend/           # FastAPI (Python Server)
```

---

## ⚙️ Quick Start

### 1. Get a Free Groq API Key
- Go to [console.groq.com](https://console.groq.com)
- Standard free tier (no credit card required) provides fast, high-quality analysis.

### 2. Setup Backend (Python)
Ensure Python 3.9+ is installed.

```powershell
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set your API Key (Windows PowerShell)
$env:GROQ_API_KEY="gsk_your_key_here"

# 4. Run the server
python server.py
```
*Note: For macOS/Linux, use `export GROQ_API_KEY="your_key"` before running.*

### 3. Setup Frontend (React)
Ensure [Node.js](https://nodejs.org/) is installed.

```powershell
# 1. Navigate to frontend (from project root)
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

---

## 🔌 Core Tech Stack

| Component | Technology | Role |
|-----------|------------|------|
| **Frontend** | React / Vite / CSS3 | Premium Dashboard UI |
| **Backend** | FastAPI / Python | Real-time Decision Engine |
| **Database** | SQLite | Audit Trail & Governance Log |
| **AI Layer** | Groq (Llama 3.1) | Autonomous Risk Analysis |
| **Charts** | Chart.js | Drift & Metric Visualization |

---

## 🔒 Security Note
In this modern split architecture, your **Groq API key stays only on the server**. The frontend never sees or stores sensitive keys, ensuring a production-ready security posture.

---

## 📡 API Reference

- **Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Prediction**: `POST /predict`
- **Governance Logs**: `GET /logs`
- **Bias Monitoring**: `GET /audit/bias`
- **Drift Analysis**: `GET /audit/drift`
