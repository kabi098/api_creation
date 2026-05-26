// src/hooks/useTodos.js
import { useState, useEffect, useCallback } from 'react';
import { todosApi } from '../services/api';

function useTodos() {
  const [todos,   setTodos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* ── Fetch all todos from backend ── */
  const fetchTodos = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await todosApi.list({ sort: 'createdAt', order: 'desc', limit: 100, ...params });
      setTodos(res?.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  /* ── Add ── */
  const addTodo = useCallback(async ({ text, priority }) => {
    setError(null);
    try {
      const res = await todosApi.create(text, priority);
      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /* ── Toggle completed ── */
  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    try {
      const res = await todosApi.patch(id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => t.id === id ? res.data : t));
    } catch (err) {
      setError(err.message);
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => t.id === id ? { ...t, completed: todo.completed } : t)
      );
    }
  }, [todos]);

  /* ── Edit text ── */
  const editTodo = useCallback(async (id, newText) => {
    setError(null);
    try {
      const res = await todosApi.patch(id, { text: newText });
      setTodos((prev) => prev.map((t) => t.id === id ? res.data : t));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /* ── Delete one ── */
  const deleteTodo = useCallback(async (id) => {
    // Optimistic update
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todosApi.delete(id);
    } catch (err) {
      setError(err.message);
      fetchTodos(); // restore on failure
    }
  }, [fetchTodos]);

  /* ── Clear all completed ── */
  const clearCompleted = useCallback(async () => {
    setError(null);
    try {
      await todosApi.bulk('delete_completed');
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    refetch: fetchTodos,
  };
}

export default useTodos;