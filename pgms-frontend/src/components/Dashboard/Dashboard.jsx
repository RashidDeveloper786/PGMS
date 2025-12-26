import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/guestService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalRooms: 40,
    occupiedRooms: 0,
    availableRooms: 40,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentGuests, setRecentGuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
      setRecentGuests(data.recentGuests);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default data on error
      setStats({
        totalGuests: 15,
        totalRooms: 40,
        occupiedRooms: 12,
        availableRooms: 28,
        pendingPayments: 8
      });
      setRecentGuests([
        { id: 1, name: 'John Doe', roomNumber: 101, admitDate: '2024-01-15', paymentStatus: 'paid' },
        { id: 2, name: 'Jane Smith', roomNumber: 102, admitDate: '2024-01-16', paymentStatus: 'pending' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage > 90) return '#dc3545';
    if (percentage > 70) return '#ffc107';
    return '#28a745';
  };

  const occupancyPercentage = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);

  const handleAddGuest = () => {
    navigate('/guests/add');
  };

  const handleManageRooms = () => {
    navigate('/rooms');
  };

  const handleRecordPayment = () => {
    navigate('/payments');
  };

  const handleViewAllGuests = () => {
    navigate('/guests');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin! Here's what's happening with your PG.</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#667eea' }}>
                👥
              </div>
              <div className="stat-content">
                <h3>{stats.totalGuests}</h3>
                <p>Total Guests</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#764ba2' }}>
                🏠
              </div>
              <div className="stat-content">
                <h3>{stats.occupiedRooms} / {stats.totalRooms}</h3>
                <p>Rooms Occupied</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#28a745' }}>
                ✅
              </div>
              <div className="stat-content">
                <h3>{stats.availableRooms}</h3>
                <p>Available Rooms</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ffc107' }}>
                💰
              </div>
              <div className="stat-content">
                <h3>{stats.pendingPayments}</h3>
                <p>Pending Payments</p>
              </div>
            </div>
          </div>

          {/* Occupancy Chart */}
          <div className="card occupancy-card">
            <h2>Occupancy Rate</h2>
            <div className="occupancy-chart">
              <div className="occupancy-bar">
                <div 
                  className="occupancy-fill"
                  style={{
                    width: `${occupancyPercentage}%`,
                    backgroundColor: getOccupancyColor(occupancyPercentage)
                  }}
                ></div>
              </div>
              <div className="occupancy-stats">
                <span className="occupancy-percentage">{occupancyPercentage}% Occupied</span>
                <span className="rooms-available">{stats.availableRooms} Rooms Available</span>
              </div>
            </div>
          </div>

          {/* Recent Guests */}
          <div className="card recent-guests-card">
            <div className="section-header">
              <h2>Recent Guests</h2>
              <button 
                className="btn btn-primary"
                onClick={handleViewAllGuests}
              >
                View All
              </button>
            </div>
            {recentGuests.length === 0 ? (
              <div className="no-data">
                <p>No recent guests found</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Room No</th>
                    <th>Admit Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGuests.map(guest => (
                    <tr key={guest.id}>
                      <td>
                        <div className="guest-name-cell">
                          <span className="guest-avatar">
                            {guest.name?.charAt(0) || 'G'}
                          </span>
                          {guest.name}
                        </div>
                      </td>
                      <td>{guest.roomNumber}</td>
                      <td>{guest.admitDate}</td>
                      <td>
                        <span className={`status-badge ${guest.paymentStatus}`}>
                          {guest.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/guests/${guest.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card quick-actions-card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={handleAddGuest}>
                <span className="action-icon">➕</span>
                Add New Guest
              </button>
              <button className="btn btn-secondary" onClick={handleManageRooms}>
                <span className="action-icon">🏠</span>
                Manage Rooms
              </button>
              <button className="btn btn-success" onClick={handleRecordPayment}>
                <span className="action-icon">💰</span>
                Record Payment
              </button>
              <button className="btn btn-warning">
                <span className="action-icon">📊</span>
                Generate Report
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;