import React, { useState, useEffect } from 'react';
import { getAllGuests, updatePaymentStatus } from '../../services/guestService';
import './Payments.css';

const PaymentStatus = () => {
  const [guests, setGuests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await getAllGuests();
      setGuests(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (guestId, status) => {
    try {
      await updatePaymentStatus(guestId, selectedMonth, status);
      fetchGuests();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const filteredGuests = guests.filter(guest => {
    if (filter === 'all') return true;
    return guest.paymentStatus === filter;
  });

  const getPaymentSummary = () => {
    const total = guests.length;
    const paid = guests.filter(g => g.paymentStatus === 'paid').length;
    const pending = guests.filter(g => g.paymentStatus === 'pending').length;
    const overdue = guests.filter(g => g.paymentStatus === 'overdue').length;
    
    return { total, paid, pending, overdue };
  };

  const summary = getPaymentSummary();

  return (
    <div className="payment-management">
      <div className="payment-header">
        <h1>Payment Management</h1>
        <div className="payment-controls">
          <div className="month-selector">
            <label>Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-control"
            />
          </div>
          <button className="btn btn-primary" onClick={() => alert('Report generation feature coming soon!')}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card total">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>{summary.total}</h3>
            <p>Total Guests</p>
          </div>
        </div>
        
        <div className="summary-card paid">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>{summary.paid}</h3>
            <p>Paid</p>
          </div>
        </div>
        
        <div className="summary-card pending">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <h3>{summary.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="summary-card overdue">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <h3>{summary.overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      <div className="payment-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Payments
          </button>
          <button 
            className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Paid
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
        </div>
      </div>

      <div className="card">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Room No</th>
              <th>Admit Date</th>
              <th>Amount Due</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Loading...</td>
              </tr>
            ) : filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No guests found</td>
              </tr>
            ) : (
              filteredGuests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.roomNumber}</td>
                  <td>{guest.admitDate}</td>
                  <td className="amount">₹5,000</td>
                  <td>
                    <span className={`payment-status-badge ${guest.paymentStatus}`}>
                      {guest.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="payment-actions">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handlePaymentUpdate(guest.id, 'paid')}
                        disabled={guest.paymentStatus === 'paid'}
                      >
                        Mark Paid
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => handlePaymentUpdate(guest.id, 'pending')}
                        disabled={guest.paymentStatus === 'pending'}
                      >
                        Mark Pending
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handlePaymentUpdate(guest.id, 'overdue')}
                        disabled={guest.paymentStatus === 'overdue'}
                      >
                        Mark Overdue
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bulk-actions">
        <h3>Bulk Actions</h3>
        <div className="bulk-buttons">
          <button className="btn btn-success" onClick={() => alert('Bulk mark paid feature coming soon!')}>
            Mark All as Paid
          </button>
          <button className="btn btn-warning" onClick={() => alert('Reminder feature coming soon!')}>
            Send Reminders
          </button>
          <button className="btn btn-primary" onClick={() => alert('Export feature coming soon!')}>
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;