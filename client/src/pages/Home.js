// src/pages/Home.js
import React from 'react';
import TodoInput   from '../components/TodoInput';
import TodoList    from '../components/TodoList';
import useTodos    from '../hooks/useTodos';
import useLocalStorage from '../hooks/useLocalStorage';

function Home() {
  // All todo state & API calls managed by useTodos
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  // Keep filter preference in localStorage so it survives page refresh
  const [filter, setFilter] = useLocalStorage('todo-filter', 'all');

  const activeCount    = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) =>  t.completed).length;

  return (
    <div className="home">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">
            <span className="title-accent">TODO</span>
          </h1>
          <div className="header-stats">
            <span className="stat">
              <strong>{activeCount}</strong> remaining
            </span>
            <span className="stat-divider">·</span>
            <span className="stat">
              <strong>{completedCount}</strong> done
            </span>
          </div>
        </div>
        <p className="app-subtitle">Stay focused. Ship it.</p>

        {/* Backend connection indicator */}
        <div className={`connection-badge ${error ? 'disconnected' : 'connected'}`}>
          <span className="dot" />
          {error ? 'Backend offline' : 'Connected to API'}
        </div>
      </header>

      {/* ── Input ── */}
      <TodoInput onAdd={addTodo} disabled={loading} />

      {/* ── Filters ── */}
      <div className="filter-bar">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear done
          </button>
        )}
      </div>

      {/* ── List ── */}
      <TodoList
        todos={todos}
        filter={filter}
        loading={loading}
        error={error}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  );
}

export default Home;
