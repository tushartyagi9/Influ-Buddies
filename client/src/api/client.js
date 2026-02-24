const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050';

async function request(path, options = {}) {
  const token = localStorage.getItem('influ_buddies_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = res.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function fetchInfluencers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const qs = query ? `?${query}` : '';
  return request(`/api/influencers${qs}`);
}

export function fetchInfluencer(id) {
  return request(`/api/influencers/${id}`);
}

export function registerUser(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function fetchCurrentUser() {
  return request('/api/auth/me');
}

