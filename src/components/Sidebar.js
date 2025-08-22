import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/clients', label: 'Clients', icon: '🏢' },
    { path: '/batches', label: 'Batches', icon: '🎓' },
    { path: '/assignments', label: 'Assignments', icon: '📝' },
    { path: '/assessments', label: 'Assessments', icon: '🧪' },
    { path: '/questions', label: 'Questions', icon: '❓' }
  ];

  return (
    <nav className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-icon">🧭</span>
        <span>Navigation</span>
      </div>
      <ul className="nav">
        {navItems.map(item => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
