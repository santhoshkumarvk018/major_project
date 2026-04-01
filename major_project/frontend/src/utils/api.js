const BACKEND_URL = 'http://localhost:8000';

export const fetchLogs = async (limit = 1000) => {
  const response = await fetch(`${BACKEND_URL}/logs?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
};

export const predictLoan = async (loanData) => {
  const response = await fetch(`${BACKEND_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData),
  });
  if (!response.ok) throw new Error('Prediction failed');
  return response.json();
};

export const fetchAuditDrift = async () => {
  const response = await fetch(`${BACKEND_URL}/audit/drift`);
  if (!response.ok) throw new Error('Failed to fetch drift audit');
  return response.json();
};

export const fetchAuditBias = async () => {
  const response = await fetch(`${BACKEND_URL}/audit/bias`);
  if (!response.ok) throw new Error('Failed to fetch bias audit');
  return response.json();
};

export const fetchModels = async () => {
  const response = await fetch(`${BACKEND_URL}/models`);
  if (!response.ok) throw new Error('Failed to fetch model metrics');
  return response.json();
};

export const analyzeAI = async (message, system) => {
  const response = await fetch(`${BACKEND_URL}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, system }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'AI Analysis failed');
  }
  return response.json();
};
