'use strict';

const { v4: uuidv4 } = require('uuid');
const Service = require('./Service');

/* ── In-memory store ─────────────────────────────────────── */
const store = new Map();

/* Seed a couple of example todos so the API isn't empty */
const seed = [
  { id: uuidv4(), text: 'Read the API docs',   priority: 'high',   completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), completedAt: null },
  { id: uuidv4(), text: 'Build something cool', priority: 'medium', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), completedAt: null },
];
seed.forEach((t) => store.set(t.id, t));

/* ── Helpers ─────────────────────────────────────────────── */
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function allTodos() {
  return Array.from(store.values());
}

function sortTodos(list, sortField = 'createdAt', order = 'desc') {
  return [...list].sort((a, b) => {
    let va = a[sortField];
    let vb = b[sortField];
    if (sortField === 'priority') { va = PRIORITY_ORDER[va]; vb = PRIORITY_ORDER[vb]; }
    if (va < vb) return order === 'asc' ? -1 : 1;
    if (va > vb) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

function paginate(list, page = 1, limit = 20) {
  const p     = Math.max(1, parseInt(page, 10));
  const l     = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const total = list.length;
  const start = (p - 1) * l;
  return {
    data: list.slice(start, start + l),
    pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
  };
}

/* ── Service class ───────────────────────────────────────── */
class TodosService {

  /**
   * GET /todos
   */
  static async listTodos({ filter = 'all', priority, sort = 'createdAt', order = 'desc', page = 1, limit = 20 } = {}) {
    try {
      let list = allTodos();

      // filter by status
      if (filter === 'active')    list = list.filter((t) => !t.completed);
      if (filter === 'completed') list = list.filter((t) =>  t.completed);

      // filter by priority
      if (priority) list = list.filter((t) => t.priority === priority);

      list = sortTodos(list, sort, order);
      const result = paginate(list, page, limit);
      return Service.successResponse(result);
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * POST /todos
   */
  static async createTodo({ body } = {}) {
    try {
      const { text, priority = 'medium' } = body || {};

      if (!text || !text.trim()) {
        return Service.rejectResponse('text is required', 400, 'VALIDATION_ERROR');
      }
      if (text.trim().length > 200) {
        return Service.rejectResponse('text must be 200 characters or fewer', 400, 'VALIDATION_ERROR');
      }
      if (!['high', 'medium', 'low'].includes(priority)) {
        return Service.rejectResponse('priority must be high, medium, or low', 400, 'VALIDATION_ERROR');
      }

      const now  = new Date().toISOString();
      const todo = {
        id:          uuidv4(),
        text:        text.trim(),
        priority,
        completed:   false,
        createdAt:   now,
        updatedAt:   now,
        completedAt: null,
      };

      store.set(todo.id, todo);
      return Service.successResponse({ data: todo }, 201);
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * GET /todos/:id
   */
  static async getTodo({ id } = {}) {
    try {
      const todo = store.get(id);
      if (!todo) return Service.rejectResponse(`Todo '${id}' not found`, 404, 'NOT_FOUND');
      return Service.successResponse({ data: todo });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * PUT /todos/:id  — full replacement
   */
  static async replaceTodo({ id, body } = {}) {
    try {
      const existing = store.get(id);
      if (!existing) return Service.rejectResponse(`Todo '${id}' not found`, 404, 'NOT_FOUND');

      const { text, priority, completed } = body || {};
      if (!text || !text.trim()) return Service.rejectResponse('text is required', 400, 'VALIDATION_ERROR');
      if (!['high', 'medium', 'low'].includes(priority)) return Service.rejectResponse('Invalid priority', 400, 'VALIDATION_ERROR');
      if (typeof completed !== 'boolean') return Service.rejectResponse('completed must be boolean', 400, 'VALIDATION_ERROR');

      const now  = new Date().toISOString();
      const todo = {
        ...existing,
        text:        text.trim(),
        priority,
        completed,
        updatedAt:   now,
        completedAt: completed && !existing.completed ? now : (completed ? existing.completedAt : null),
      };

      store.set(id, todo);
      return Service.successResponse({ data: todo });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * PATCH /todos/:id  — partial update
   */
  static async patchTodo({ id, body } = {}) {
    try {
      const existing = store.get(id);
      if (!existing) return Service.rejectResponse(`Todo '${id}' not found`, 404, 'NOT_FOUND');
      if (!body || Object.keys(body).length === 0) return Service.rejectResponse('At least one field required', 400, 'VALIDATION_ERROR');

      const { text, priority, completed } = body;

      if (text !== undefined && (!text.trim() || text.trim().length > 200)) {
        return Service.rejectResponse('text must be 1-200 characters', 400, 'VALIDATION_ERROR');
      }
      if (priority !== undefined && !['high', 'medium', 'low'].includes(priority)) {
        return Service.rejectResponse('Invalid priority', 400, 'VALIDATION_ERROR');
      }

      const now  = new Date().toISOString();
      const todo = {
        ...existing,
        ...(text     !== undefined ? { text: text.trim() } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(completed !== undefined ? { completed } : {}),
        updatedAt: now,
        completedAt:
          completed === true  && !existing.completed ? now :
          completed === false ? null :
          existing.completedAt,
      };

      store.set(id, todo);
      return Service.successResponse({ data: todo });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * DELETE /todos/:id
   */
  static async deleteTodo({ id } = {}) {
    try {
      if (!store.has(id)) return Service.rejectResponse(`Todo '${id}' not found`, 404, 'NOT_FOUND');
      store.delete(id);
      return Service.successResponse(null, 204);
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }

  /**
   * POST /todos/bulk
   */
  static async bulkTodos({ body } = {}) {
    try {
      const { action, ids } = body || {};
      const validActions = ['delete', 'complete', 'incomplete', 'delete_completed', 'complete_all', 'incomplete_all'];
      if (!validActions.includes(action)) {
        return Service.rejectResponse(`Invalid action. Must be one of: ${validActions.join(', ')}`, 400, 'VALIDATION_ERROR');
      }

      let affected = 0;
      const affectedIds = [];
      const now = new Date().toISOString();

      if (action === 'delete') {
        if (!ids || !ids.length) return Service.rejectResponse('ids required for delete action', 400, 'VALIDATION_ERROR');
        ids.forEach((id) => { if (store.has(id)) { store.delete(id); affected++; affectedIds.push(id); } });
      }

      if (action === 'complete') {
        if (!ids || !ids.length) return Service.rejectResponse('ids required for complete action', 400, 'VALIDATION_ERROR');
        ids.forEach((id) => {
          const t = store.get(id);
          if (t) { store.set(id, { ...t, completed: true, completedAt: now, updatedAt: now }); affected++; affectedIds.push(id); }
        });
      }

      if (action === 'incomplete') {
        if (!ids || !ids.length) return Service.rejectResponse('ids required for incomplete action', 400, 'VALIDATION_ERROR');
        ids.forEach((id) => {
          const t = store.get(id);
          if (t) { store.set(id, { ...t, completed: false, completedAt: null, updatedAt: now }); affected++; affectedIds.push(id); }
        });
      }

      if (action === 'delete_completed') {
        allTodos().filter((t) => t.completed).forEach((t) => { store.delete(t.id); affected++; affectedIds.push(t.id); });
      }

      if (action === 'complete_all') {
        allTodos().filter((t) => !t.completed).forEach((t) => {
          store.set(t.id, { ...t, completed: true, completedAt: now, updatedAt: now }); affected++; affectedIds.push(t.id);
        });
      }

      if (action === 'incomplete_all') {
        allTodos().filter((t) => t.completed).forEach((t) => {
          store.set(t.id, { ...t, completed: false, completedAt: null, updatedAt: now }); affected++; affectedIds.push(t.id);
        });
      }

      return Service.successResponse({ action, affected, ids: affectedIds });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }
}

module.exports = TodosService;