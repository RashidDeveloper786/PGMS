import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Layout.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    
    // Call parent logout handler if provided
    if (onLogout) {
      onLogout();
    } else {
      // Fallback navigation
      navigate('/');
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/guests', icon: '👥', label: 'Guest Management' },
    { path: '/rooms', icon: '🏠', label: 'Room Management' },
    { path: '/payments', icon: '💰', label: 'Payments' },
  ];

  // Get last login from localStorage
  const getLastLogin = () => {
    const lastLogin = localStorage.getItem('lastLogin');
    if (!lastLogin) return 'Not Available';
    
    const date = new Date(lastLogin);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Logout option in sidebar */}
        <div className="menu-item logout-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Logout</span>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div className="system-info">
          <div className="info-item">
            <span className="info-label">System</span>
            <span className="info-value">Version 1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Login</span>
            <span className="info-value">{getLastLogin()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;