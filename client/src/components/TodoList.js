// src/components/TodoList.js
import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, filter, loading, error, onToggle, onDelete, onEdit }) {

  if (loading) {
    return (
      <div className="empty-state">
        <span className="empty-icon spinning">◎</span>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state error-state">
        <span className="empty-icon">⚠</span>
        <p>Backend error: {error}</p>
        <small>Make sure the API is running at /kabi/api/v1, or set REACT_APP_API_BASE_URL to your backend URL.</small>
      </div>
    );
  }

  const filtered = todos.filter((t) => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return  t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return  1;
    return order[a.priority] - order[b.priority];
  });

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">◎</span>
        <p>
          {filter === 'completed' ? 'Nothing completed yet.'
           : filter === 'active'  ? 'All done! Great work.'
           :                        'No tasks yet. Add one above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {sorted.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TodoList;
