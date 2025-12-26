import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token === 'Rashid') {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    { icon: '🍽️', title: '4 Times Meals', description: 'Daily breakfast, lunch, evening snacks & dinner' },
    { icon: '⚡', title: 'Electricity Bill Free', description: 'No extra charges for electricity usage' },
    { icon: '❄️', title: 'Cooler in Each Room', description: 'Air cooler provided in every room' },
    { icon: '🧺', title: 'Washing Machine', description: 'Free laundry facility available' },
    { icon: '💧', title: 'RO Water Purifier', description: '24/7 purified drinking water' },
    { icon: '🛏️', title: 'Furnished Rooms', description: 'Complete furniture in all rooms' },
    { icon: '📶', title: 'High-Speed WiFi', description: 'Unlimited internet access' },
    { icon: '🚿', title: 'Hot Water', description: '24/7 hot water supply' },
    { icon: '🧹', title: 'Daily Cleaning', description: 'Regular room and common area cleaning' },
    { icon: '🔒', title: '24/7 Security', description: 'CCTV surveillance & security guard' },
    { icon: '🏥', title: 'Medical Support', description: 'First aid and medical assistance' },
    { icon: '🏋️', title: 'Gym Access', description: 'Basic fitness equipment available' }
  ];

  return (
    <div className="landing-page modern-theme">
      {/* Navigation - Modern Glass Morphism */}
      <nav className="modern-nav">
        <div className="nav-container">
          <div className="brand">
            <div className="logo-circle">
              <span className="logo-icon">🏠</span>
            </div>
            <div className="brand-text">
              <h1 className="brand-name">Premium PG</h1>
              <p className="brand-tagline">Luxury Student Accommodation</p>
            </div>
          </div>
          <button className="modern-login-btn" onClick={handleLogin}>
            <span className="btn-icon">🔐</span>
            Admin Portal
          </button>
        </div>
      </nav>

      {/* Hero Section with Gradient */}
      <section className="modern-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-title">
                <span className="gradient-text">Premium PG</span>
                <br />
                <span className="hero-subtitle">Redefining Student Living</span>
              </h2>
              <p className="hero-description">
                Experience luxury living with premium amenities designed for 
                students and working professionals. Your comfort is our commitment.
              </p>
              <div className="hero-actions">
                <button className="cta-primary" onClick={handleLogin}>
                  <span>Start Managing</span>
                  <span className="arrow">→</span>
                </button>
                <button className="cta-secondary" onClick={() => document.querySelector('.facilities').scrollIntoView({ behavior: 'smooth' })}>
                  View Facilities
                </button>
              </div>
            </div>
            
            {/* Stats Cards - Floating */}
            <div className="floating-stats">
              <div className="stat-card modern">
                <div className="stat-icon">🏠</div>
                <div className="stat-content">
                  <h3 className="stat-number">40+</h3>
                  <p className="stat-label">Premium Rooms</p>
                </div>
              </div>
              <div className="stat-card modern">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3 className="stat-number">100%</h3>
                  <p className="stat-label">Satisfaction Rate</p>
                </div>
              </div>
              <div className="stat-card modern">
                <div className="stat-icon">🛡️</div>
                <div className="stat-content">
                  <h3 className="stat-number">24/7</h3>
                  <p className="stat-label">Security & Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Grid with Hover Effects */}
      <section className="facilities modern-facilities">
        <div className="section-header modern">
          <h3 className="section-title">
            <span className="title-accent">Premium</span> Facilities
          </h3>
          <p className="section-subtitle">Everything for comfortable living</p>
        </div>
        
        <div className="facilities-grid modern-grid">
          {features.map((feature, index) => (
            <div key={index} className="facility-card modern-card">
              <div className="card-icon-wrapper">
                <div className="card-icon">{feature.icon}</div>
              </div>
              <div className="card-content">
                <h4 className="card-title">{feature.title}</h4>
                <p className="card-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section - Modern Card */}
      <section className="modern-contact">
        <div className="contact-container">
          <div className="contact-header">
            <h3 className="contact-title">Get In Touch</h3>
            <p className="contact-subtitle">We're here to help you find your perfect home</p>
          </div>
          
          <div className="contact-info-cards">
            <div className="contact-card modern">
              <div className="contact-icon-wrapper">
                <span className="contact-icon">📍</span>
              </div>
              <div className="contact-details">
                <h4>Location</h4>
                <p>123 Premium Street, City Center</p>
                <p className="contact-note">Near University & Metro Station</p>
              </div>
            </div>
            
            <div className="contact-card modern">
              <div className="contact-icon-wrapper">
                <span className="contact-icon">📞</span>
              </div>
              <div className="contact-details">
                <h4>Contact</h4>
                <p>+91 98765 43210</p>
                <p className="contact-note">Available 8AM - 10PM</p>
              </div>
            </div>
            
            <div className="contact-card modern">
              <div className="contact-icon-wrapper">
                <span className="contact-icon">✉️</span>
              </div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>info@premiumpg.com</p>
                <p className="contact-note">Response within 24 hours</p>
              </div>
            </div>
          </div>
          
          <div className="contact-action">
            <button className="admin-action-btn" onClick={handleLogin}>
              <span className="btn-icon">🏠</span>
              Access Management Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🏠</span>
              </div>
              <div className="footer-text">
                <h4>Premium PG</h4>
                <p className="footer-tagline">Your home away from home</p>
              </div>
            </div>
            
            <div className="footer-quick-links">
              <h5>Quick Links</h5>
              <ul>
                <li><button onClick={() => navigate('/')}>Home</button></li>
                <li><button onClick={handleLogin}>Admin Portal</button></li>
                <li><button onClick={() => document.querySelector('.modern-contact').scrollIntoView({ behavior: 'smooth' })}>Contact</button></li>
              </ul>
            </div>
            
            <div className="footer-hours">
              <h5>Office Hours</h5>
              <p>Monday - Friday: 9AM - 8PM</p>
              <p>Saturday: 10AM - 6PM</p>
              <p>Sunday: 10AM - 4PM</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              <p>© 2024 Premium PG Management System. All rights reserved.</p>
              <p className="admin-note">Administrative access restricted to authorized personnel</p>
              <p className='developer'>Designed & Developed by Rashid</p>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;