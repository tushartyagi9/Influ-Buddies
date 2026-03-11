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

// ── Opportunities ──

export function fetchOpportunities(params = {}) {
  const query = new URLSearchParams(params).toString();
  const qs = query ? `?${query}` : '';
  return request(`/api/opportunities${qs}`);
}

export function fetchMyOpportunities() {
  return request('/api/opportunities/mine');
}

export function fetchOpportunity(id) {
  return request(`/api/opportunities/${id}`);
}

export function createOpportunity(payload) {
  return request('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateOpportunity(id, payload) {
  return request(`/api/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteOpportunity(id) {
  return request(`/api/opportunities/${id}`, { method: 'DELETE' });
}

// ── Applications ──

export function applyToOpportunity(oppId, payload) {
  return request(`/api/opportunities/${oppId}/apply`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchApplicationsForOpportunity(oppId) {
  return request(`/api/opportunities/${oppId}/applications`);
}

export function updateApplicationStatus(oppId, appId, status) {
  return request(`/api/opportunities/${oppId}/applications/${appId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function fetchMyApplications() {
  return request('/api/opportunities/applications/mine');
}

// ── Messages ──

export function fetchConversations() {
  return request('/api/messages/conversations');
}

export function fetchMessages(partnerId) {
  return request(`/api/messages/${partnerId}`);
}

export function sendMessage(receiverId, content) {
  return request('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ receiverId, content }),
  });
}

