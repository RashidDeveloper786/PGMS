import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestById, deleteGuest, updatePaymentStatus } from '../../services/guestService';
import './Guests.css';

const GuestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    month: new Date().toISOString().slice(0, 7),
    amount: '5000',
    status: 'pending'
  });

  useEffect(() => {
    fetchGuestDetails();
  }, [id]);

  const fetchGuestDetails = async () => {
    try {
      setLoading(true);
      const data = await getGuestById(id);
      setGuest(data);
    } catch (err) {
      setError('Failed to load guest details');
      console.error('Error fetching guest details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      try {
        await deleteGuest(id);
        navigate('/guests');
      } catch (err) {
        setError('Failed to delete guest');
        console.error('Error deleting guest:', err);
      }
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await updatePaymentStatus(id, paymentData.month, paymentData.status);
      setIsEditingPayment(false);
      fetchGuestDetails();
    } catch (err) {
      setError('Failed to update payment');
      console.error('Error updating payment:', err);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentHistory = () => {
    const months = [
      '2024-01', '2024-02', '2024-03', '2024-04', 
      '2024-05', '2024-06', '2024-07', '2024-08'
    ];
    
    return months.map(month => ({
      month,
      amount: 5000,
      status: guest?.paymentStatus || 'pending',
      paymentDate: guest?.admitDate || null
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="guest-details-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading guest details...</p>
        </div>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div className="guest-details-container">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error || 'Guest not found'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/guests')}>
            Back to Guests
          </button>
        </div>
      </div>
    );
  }

  const paymentHistory = getPaymentHistory();

  return (
    <div className="guest-details-container">
      <div className="details-header">
        <h1>Guest Details</h1>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/guests')}
          >
            ← Back to List
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/guests/edit/${id}`)}
          >
            Edit Guest
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Guest
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="details-card">
        <div className="details-grid">
          <div className="details-section">
            <h3>Personal Information</h3>
            <div className="detail-item">
              <span className="detail-label">Guest ID:</span>
              <span className="detail-value">#{guest.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{guest.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{guest.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{guest.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Admit Date:</span>
              <span className="detail-value">{formatDate(guest.admitDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Days Stayed:</span>
              <span className="detail-value">
                {Math.floor((new Date() - new Date(guest.admitDate)) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          </div>

          <div className="details-section">
            <h3>Accommodation Details</h3>
            <div className="detail-item">
              <span className="detail-label">Room Number:</span>
              <span className="detail-value">#{guest.roomNumber || 'Not Assigned'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Room Status:</span>
              <span className="detail-value">
                <span className="room-status-badge">
                  {guest.roommates?.length === 1 ? 'Single Occupancy' : 
                   guest.roommates?.length === 2 ? 'Double Occupancy' : 'Vacant'}
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Monthly Rent:</span>
              <span className="detail-value">₹5,000</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Payment Status:</span>
              <span className="detail-value">
                <span 
                  className="payment-status-badge"
                  style={{ backgroundColor: getPaymentStatusColor(guest.paymentStatus) }}
                >
                  {guest.paymentStatus || 'pending'}
                </span>
              </span>
            </div>
            {guest.roommates && guest.roommates.length > 0 && (
              <>
                <div className="detail-item">
                  <span className="detail-label">Roommates:</span>
                  <span className="detail-value">
                    {guest.roommates.length} other guest(s)
                  </span>
                </div>
                <div className="roommates-list-detailed">
                  {guest.roommates.map((roommate, index) => (
                    <div key={index} className="roommate-item">
                      <span>{roommate.name}</span>
                      <span className="roommate-contact">{roommate.phone}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="payment-management-section">
          <div className="section-header">
            <h3>Payment Management</h3>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditingPayment(!isEditingPayment)}
            >
              {isEditingPayment ? 'Cancel' : 'Record Payment'}
            </button>
          </div>

          {isEditingPayment && (
            <div className="payment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Month</label>
                  <input
                    type="month"
                    value={paymentData.month}
                    onChange={(e) => setPaymentData({...paymentData, month: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={paymentData.status}
                    onChange={(e) => setPaymentData({...paymentData, status: e.target.value})}
                    className="form-control"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-success"
                  onClick={handlePaymentUpdate}
                >
                  Save Payment
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsEditingPayment(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="quick-payment-actions">
            <button 
              className="btn btn-success"
              onClick={() => updatePaymentStatus(id, paymentMonth, 'paid')}
            >
              Mark Current Month as Paid
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => updatePaymentStatus(id, paymentMonth, 'pending')}
            >
              Mark as Pending
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => updatePaymentStatus(id, paymentMonth, 'overdue')}
            >
              Mark as Overdue
            </button>
          </div>
        </div>

        <div className="payment-history">
          <h3>Payment History</h3>
          <div className="payment-history-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(payment.month + '-01').toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td>₹{payment.amount.toLocaleString()}</td>
                    <td>
                      <span 
                        className="payment-status-badge"
                        style={{ backgroundColor: getPaymentStatusColor(payment.status) }}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.paymentDate ? formatDate(payment.paymentDate) : 'Not Paid'}
                    </td>
                    <td>
                      <div className="payment-actions">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => updatePaymentStatus(id, payment.month, 'paid')}
                        >
                          Paid
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => updatePaymentStatus(id, payment.month, 'overdue')}
                        >
                          Overdue
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="details-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/guests/edit/${id}`)}
          >
            Edit Guest Information
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            Print Details
          </button>
          <button 
            className="btn btn-info"
            onClick={() => {
              window.location.href = `mailto:${guest.email}?subject=PG Payment Reminder&body=Dear ${guest.name},%0D%0A%0D%0AThis is a reminder regarding your payment for the current month.`;
            }}
          >
            Send Email Reminder
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => {
              const message = `Dear ${guest.name}, this is a reminder regarding your payment for the current month.`;
              window.open(`https://wa.me/${guest.phone}?text=${encodeURIComponent(message)}`, '_blank');
            }}
          >
            Send WhatsApp Reminder
          </button>
        </div>
      </div>

      <div className="notes-section card">
        <h3>Admin Notes</h3>
        <textarea 
          className="notes-textarea form-control"
          placeholder="Add notes about this guest..."
          rows="3"
        />
        <div className="notes-actions">
          <button className="btn btn-primary">Save Note</button>
          <button className="btn btn-secondary">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;