import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addGuest, updateGuest, getAvailableRooms, getGuestById } from '../../services/guestService';
import './Guests.css';

const GuestForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    admitDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'pending'
  });
  
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAvailableRooms();
    
    if (isEdit && id) {
      fetchGuestData();
    }
  }, [isEdit, id]);

  const fetchAvailableRooms = async () => {
    try {
      const rooms = await getAvailableRooms();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  const fetchGuestData = async () => {
    try {
      const guest = await getGuestById(id);
      setFormData({
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        roomNumber: guest.roomNumber,
        admitDate: guest.admitDate,
        paymentStatus: guest.paymentStatus || 'pending'
      });
    } catch (error) {
      console.error('Error fetching guest data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isEdit) {
        await updateGuest(id, formData);
      } else {
        await addGuest(formData);
      }
      navigate('/guests');
    } catch (error) {
      console.error('Error saving guest:', error);
      setErrors({ submit: error.message || 'Failed to save guest' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="guest-form-container">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Guest' : 'Add New Guest'}</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/guests')}
        >
          ← Back to List
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter guest's full name"
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label>Room Number *</label>
              <select
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
              >
                <option value="">Select a room</option>
                {availableRooms.map(room => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    Room {room.roomNumber} ({room.availableSlots || 0} slots available)
                  </option>
                ))}
              </select>
              {errors.roomNumber && <div className="error-text">{errors.roomNumber}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Admit Date</label>
              <input
                type="date"
                name="admitDate"
                value={formData.admitDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="form-control"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Guest' : 'Add Guest')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/guests')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          <div className="form-note">
            <p>* Required fields</p>
            <p>Maximum 2 guests per room</p>
          </div>
        </form>
      </div>

      {/* Room Info */}
      <div className="card room-info">
        <h3>Room Information</h3>
        <div className="rooms-grid">
          {Array.from({ length: 40 }, (_, i) => i + 101).map(roomNumber => {
            const room = availableRooms.find(r => r.roomNumber === roomNumber);
            const isAvailable = room && (room.availableSlots || 0) > 0;
            
            return (
              <div 
                key={roomNumber}
                className={`room-box ${isAvailable ? 'available' : 'occupied'}`}
              >
                <div className="room-number">#{roomNumber}</div>
                <div className="room-status">
                  {isAvailable ? 
                    `Available (${room.availableSlots || 0}/2)` : 
                    'Occupied'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuestForm;