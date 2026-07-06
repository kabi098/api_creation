// src/services/api.js
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/kabi/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);

  // 204 No Content (delete)
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!isJson) {
    throw new Error(`Expected JSON from backend but received ${contentType || 'an unknown content type'} from ${url}`);
  }

  if (!response.ok) {
    const message = data?.error?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/* ── Todos ── */
export const todosApi = {
  // GET /todos?filter=all&sort=createdAt&order=desc
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/todos${qs ? `?${qs}` : ''}`);
  },

  // POST /todos
  create: (text, priority = 'medium') =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify({ text, priority }),
    }),

  // GET /todos/:id
  get: (id) => request(`/todos/${id}`),

  // PATCH /todos/:id  (partial update)
  patch: (id, fields) =>
    request(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(fields),
    }),

  // DELETE /todos/:id
  delete: (id) =>
    request(`/todos/${id}`, { method: 'DELETE' }),

  // POST /todos/bulk
  bulk: (action, ids) =>
    request('/todos/bulk', {
      method: 'POST',
      body: JSON.stringify({ action, ...(ids ? { ids } : {}) }),
    }),
};

/* ── Stats ── */
export const statsApi = {
  get: () => request('/stats'),
};
