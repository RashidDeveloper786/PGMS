import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all local storage
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    
    // Call parent logout handler if provided
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to landing page
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">🏠</div>
        <div className="brand-text">
          <h2>PG Management System</h2>
          <p>Admin Dashboard</p>
        </div>
      </div>
      
      <div className="navbar-actions">
        <div className="admin-info">
          <span className="admin-name">Admin User</span>
          <span className="admin-role">Administrator</span>
        </div>
        <button 
          className="btn btn-logout" 
          onClick={handleLogout}
          title="Click to logout and return to homepage"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;