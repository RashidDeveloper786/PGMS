import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setIsLoggedIn(true);
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        document.querySelector('.login-success').classList.add('active');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Invalid credentials. Please try again.');
        document.querySelector('.login-card').classList.add('shake');
        setTimeout(() => {
          document.querySelector('.login-card').classList.remove('shake');
        }, 500);
      }
    } catch (err) {
      setError('Login failed. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Please contact system administrator to reset your password.');
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-gradient"></div>
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-left-panel">
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-circle">
                <span className="logo-icon">🏠</span>
              </div>
              <div className="logo-text">
                <h1 className="brand-name">Premium PG</h1>
                <p className="brand-tagline">Management System</p>
              </div>
            </div>
            
            <div className="brand-features">
              <h3>Welcome Back, Admin!</h3>
              <p>Access your PG management dashboard with full control over:</p>
              <ul className="features-list">
                <li>
                  <span className="feature-icon">👥</span>
                  <span>Guest Management</span>
                </li>
                <li>
                  <span className="feature-icon">🏠</span>
                  <span>Room Allocation</span>
                </li>
                <li>
                  <span className="feature-icon">💰</span>
                  <span>Payment Tracking</span>
                </li>
                <li>
                  <span className="feature-icon">📊</span>
                  <span>Dashboard Analytics</span>
                </li>
              </ul>
            </div>

            <div className="system-stats">
              <div className="stat-item">
                <div className="stat-number">40+</div>
                <div className="stat-label">Rooms Managed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Happy Residents</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">System Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right-panel">
          <div className="login-card-wrapper">
            <div className="login-card">
              {/* Success Animation Overlay */}
              <div className="login-success">
                <div className="success-icon">✓</div>
                <p>Login Successful!</p>
                <p>Redirecting to dashboard...</p>
              </div>

              {/* Card Header */}
              <div className="card-header">
                <div className="header-icon">
                  <span className="lock-icon">🔐</span>
                </div>
                <h2 className="card-title">Admin Login</h2>
                <p className="card-subtitle">Secure access to management portal</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login-form">
                {error && (
                  <div className="error-message slide-in">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className={`form-group ${activeField === 'email' ? 'active' : ''} ${email ? 'has-value' : ''}`}>
                  <label htmlFor="email" className="floating-label">
                    <span className="label-icon">📧</span>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    placeholder=" "
                    required
                    className="form-input"
                    disabled={loading}
                  />
                  <div className="input-border"></div>
                  <div className="input-underline"></div>
                </div>

                {/* Password Input */}
                <div className={`form-group ${activeField === 'password' ? 'active' : ''} ${password ? 'has-value' : ''}`}>
                  <label htmlFor="password" className="floating-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      placeholder=" "
                      required
                      className="form-input"
                      disabled={loading}
                    />
                    
                  </div>
                  <div className="input-border"></div>
                  <div className="input-underline"></div>
                </div>

                {/* Options Row */}
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`login-submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span className="btn-text">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">→</span>
                      <span className="btn-text">Login to Dashboard</span>
                    </>
                  )}
                </button>

                

                {/* Security Info */}
                <div className="security-info">
                  <div className="security-icon">🛡️</div>
                  <div className="security-text">
                    <p>Your login is secured with encryption</p>
                    <p className="security-sub">All activities are logged for security purposes</p>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">Verifying credentials...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;