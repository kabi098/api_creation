// src/components/TodoItem.js
import React, { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText,  setEditText]  = useState(todo.text); // ← fixed typo (was setEdiwtText)

  // ← removed the broken useEffect that called setData (undefined) on /api/v1 root

  const handleEditSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed); // hits PATCH /todos/:id via useTodos
    } else {
      setEditText(todo.text);   // revert if unchanged
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter')  handleEditSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const priorityLabel = { high: '!!!', medium: '!!', low: '!' }[todo.priority] || '!!';
  const priorityClass = `priority-${todo.priority}`;

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${priorityClass}`}>

      {/* Checkbox */}
      <button className="check-btn" onClick={() => onToggle(todo.id)}>
        <span className="checkmark">{todo.completed ? '✓' : ''}</span>
      </button>

      {/* Priority badge */}
      <span className={`priority-badge ${priorityClass}`}>{priorityLabel}</span>

      {/* Text / edit input */}
      <div className="todo-text-area">
        {isEditing ? (
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            autoFocus
            maxLength={200}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setIsEditing(true)}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
        <span className="todo-meta">
          {new Date(todo.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day:   'numeric',
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="todo-actions">
        {!todo.completed && (
          <button
            className="action-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit"
          >
            ✎
          </button>
        )}
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TodoItem;