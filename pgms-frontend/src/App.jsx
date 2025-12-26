import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import GuestList from './components/Guests/GuestList';
import GuestForm from './components/Guests/GuestForm';
import GuestDetails from './components/Guests/GuestDetails';
import RoomList from './components/Rooms/RoomList';
import PaymentStatus from './components/Payments/PaymentStatus';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import * as authService from './services/auth';
import './App.css';

// Private Route Component - Redirects to landing page if not authenticated
const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" />; // Changed to "/" (landing page)
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on app load
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsLoggedIn(authStatus);
    };
    
    checkAuth();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    if (status) {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate('/'); // Navigate to landing page after logout
  };

  return (
    <div className="App">
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <div className="main-container">
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}
        <div className="content guest">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={handleLogin} />
            } />
            
            {/* Protected Routes - Redirect to landing page if not logged in */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/guests" element={
              <PrivateRoute>
                <GuestList />
              </PrivateRoute>
            } />
            
            <Route path="/guests/add" element={
              <PrivateRoute>
                <GuestForm />
              </PrivateRoute>
            } />
            
            <Route path="/guests/edit/:id" element={
              <PrivateRoute>
                <GuestForm isEdit={true} />
              </PrivateRoute>
            } />
            
            <Route path="/guests/:id" element={
              <PrivateRoute>
                <GuestDetails />
              </PrivateRoute>
            } />
            
            <Route path="/rooms" element={
              <PrivateRoute>
                <RoomList />
              </PrivateRoute>
            } />
            
            <Route path="/payments" element={
              <PrivateRoute>
                <PaymentStatus />
              </PrivateRoute>
            } />
            
            {/* Catch all route - redirect based on auth status */}
            <Route path="*" element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}