// API utility for backend requests
export const API_BASE = 'http://localhost:5000/api'; // Changed from 3000 to 5000

export async function fetchSurveys() {
  const res = await fetch(`${API_BASE}/surveys`);
  if (!res.ok) throw new Error('Failed to fetch surveys');
  return res.json();
}

export async function fetchSurveyById(id: string) {
  const res = await fetch(`${API_BASE}/surveys/${id}`);
  if (!res.ok) throw new Error('Failed to fetch survey');
  return res.json();
}

export async function submitSurveyResponse(surveyId: string, answers: any, token?: string) {
  const res = await fetch(`${API_BASE}/surveys/${surveyId}/response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error('Failed to submit survey');
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function fetchUserSubmissions(token: string) {
  const res = await fetch(`${API_BASE}/surveys/submissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}
