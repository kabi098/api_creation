// src/components/TodoInput.js
import React, { useState } from 'react';

function TodoInput({ onAdd, disabled }) {
  const [text,     setText]     = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, priority });
    setText('');
    setPriority('medium');
  };

  return (
    <div className="todo-input-wrapper">
      <div className="input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          maxLength={200}
          disabled={disabled}
          autoFocus
        />
        <select
          className="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={disabled}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button
          className="add-btn"
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
        >
          <span>+</span>
        </button>
      </div>
    </div>
  );
}

export default TodoInput;