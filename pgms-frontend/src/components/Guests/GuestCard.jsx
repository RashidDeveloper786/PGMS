import React from 'react';
import './Guests.css';

const GuestCard = ({ guest, onEdit, onDelete, onView }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="guest-card">
      <div className="guest-card-header">
        <h3>{guest.name}</h3>
        <span 
          className="payment-status"
          style={{ backgroundColor: getPaymentStatusColor(guest.paymentStatus) }}
        >
          {guest.paymentStatus}
        </span>
      </div>
      
      <div className="guest-card-body">
        <div className="guest-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{guest.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone:</span>
            <span className="info-value">{guest.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Room:</span>
            <span className="info-value">#{guest.roomNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Admit Date:</span>
            <span className="info-value">{guest.admitDate}</span>
          </div>
        </div>
        
        {guest.roommates && guest.roommates.length > 0 && (
          <div className="roommates-section">
            <span className="roommates-label">Roommates:</span>
            <div className="roommates-list">
              {guest.roommates.map((roommate, index) => (
                <span key={index} className="roommate-tag">
                  {roommate.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="guest-card-actions">
        <button className="btn btn-primary btn-sm" onClick={onView}>
          View
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GuestCard;