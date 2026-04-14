import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import CardHandle from './CardHandle';
import { useTaskContext } from '../hooks/TaskContext';
import { Link, useLocation } from 'react-router-dom';

const PRIORITY_COLOR: Record<string, string> = {
  High: '#dc3545',
  Medium: '#ffc107',
  Low: '#198754',
};

const NavBar: React.FC = () => {
  const { task, filterTasks, tasks, darkMode, toggleDarkMode } = useTaskContext();
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const location = useLocation();

  const countByPriority = (p: string) => tasks.filter(t => t.priority === p).length;
  const pendingCount = tasks.filter(t => !t.done).length;

  const navLinkStyle = (path: string): React.CSSProperties => ({
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: location.pathname === path ? 600 : 400,
    color: location.pathname === path ? '#e74c3c' : darkMode ? '#ccc' : '#444',
    background: location.pathname === path ? (darkMode ? '#2a1a2e' : '#fff0f0') : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    fontSize: '0.9rem',
  });

  const navbarBg = darkMode ? '#16213e' : '#ffffff';
  const borderColor = darkMode ? '#0f3460' : '#e8e8e8';

  return (
    <div>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: navbarBg,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '0 16px',
        }}
      >
        <div className="d-flex align-items-center justify-content-between" style={{ height: '56px' }}>
          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px', color: darkMode ? '#e0e0e0' : '#333', textTransform: 'uppercase' }}>
              Doit<span style={{ color: '#e74c3c' }}>Now</span>
            </span>
            {pendingCount > 0 && (
              <span className="badge ms-2" style={{ background: '#e74c3c', fontSize: '0.65rem', verticalAlign: 'middle' }}>
                {pendingCount}
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="d-none d-md-flex align-items-center gap-1">
            <Link to="/" style={navLinkStyle('/')}>Home</Link>
            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>
            <Link to="/kanban" style={navLinkStyle('/kanban')}>Kanban</Link>

            {/* Filter dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setFilterOpen(p => !p)}
                style={{
                  ...navLinkStyle(''),
                  background: 'none',
                  border: '1px solid ' + borderColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: darkMode ? '#ccc' : '#444',
                }}
              >
                Filter
                <span className="badge bg-secondary ms-1" style={{ fontSize: '0.65rem' }}>{tasks.length}</span>
              </button>
              {filterOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: navbarBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    minWidth: 200,
                    zIndex: 200,
                    padding: '6px 0',
                  }}
                >
                  {[
                    { label: 'All Tasks', priority: 'All', badge: tasks.length, color: '#6c757d' },
                    { label: 'High Priority', priority: 'High', badge: countByPriority('High'), color: PRIORITY_COLOR.High },
                    { label: 'Medium Priority', priority: 'Medium', badge: countByPriority('Medium'), color: PRIORITY_COLOR.Medium },
                    { label: 'Low Priority', priority: 'Low', badge: countByPriority('Low'), color: PRIORITY_COLOR.Low },
                  ].map((item, i) => (
                    <React.Fragment key={item.priority}>
                      {i === 1 && <hr style={{ margin: '4px 12px', borderColor }} />}
                      <button
                        onClick={() => { filterTasks(item.priority); setFilterOpen(false); }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          padding: '8px 16px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: darkMode ? '#e0e0e0' : '#333',
                          fontSize: '0.875rem',
                        }}
                      >
                        {item.label}
                        <span className="badge ms-2" style={{ background: item.color }}>{item.badge}</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Light mode' : 'Dark mode'}
              style={{
                background: 'none',
                border: `1px solid ${borderColor}`,
                borderRadius: 8,
                padding: '5px 10px',
                cursor: 'pointer',
                color: darkMode ? '#ffc107' : '#555',
                fontSize: '0.9rem',
              }}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>

            {/* New task button */}
            <button
              onClick={() => setCreateModal(true)}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="d-none d-sm-inline">New Task</span>
            </button>

            {/* Hamburger for mobile */}
            <button
              className="d-md-none"
              onClick={() => setMenuOpen(p => !p)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#ccc' : '#555', fontSize: '1.1rem', padding: '4px 8px' }}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="d-md-none pb-3" style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 12 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/kanban', label: 'Kanban' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{ ...navLinkStyle(to), display: 'block', marginBottom: 4 }}
              >
                {label}
              </Link>
            ))}
            <hr style={{ borderColor }} />
            {[
              { label: 'All Tasks', priority: 'All', badge: tasks.length, color: '#6c757d' },
              { label: 'High Priority', priority: 'High', badge: countByPriority('High'), color: PRIORITY_COLOR.High },
              { label: 'Medium Priority', priority: 'Medium', badge: countByPriority('Medium'), color: PRIORITY_COLOR.Medium },
              { label: 'Low Priority', priority: 'Low', badge: countByPriority('Low'), color: PRIORITY_COLOR.Low },
            ].map(item => (
              <button
                key={item.priority}
                onClick={() => { filterTasks(item.priority); setMenuOpen(false); }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  width: '100%', padding: '8px 4px', background: 'none', border: 'none',
                  cursor: 'pointer', color: darkMode ? '#e0e0e0' : '#333', fontSize: '0.875rem',
                }}
              >
                {item.label}
                <span className="badge" style={{ background: item.color }}>{item.badge}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Close filter dropdown on outside click */}
      {filterOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setFilterOpen(false)}
        />
      )}

      <CardHandle isModal={createModal} handleToggle={() => setCreateModal(false)} taskObj={task} isCreated={true} isEdited={false} />
    </div>
  );
};

export default NavBar;
