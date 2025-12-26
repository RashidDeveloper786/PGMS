import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGuests, deleteGuest } from '../../services/guestService';
import GuestCard from './GuestCard';
import './Guests.css';

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await deleteGuest(id);
        setGuests(guests.filter(guest => guest.id !== id));
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = filter === 'all' || 
      (filter === 'withRoommates' && guest.roommates && guest.roommates.length > 0) ||
      (filter === 'withoutRoommates' && (!guest.roommates || guest.roommates.length === 0));
    
    const matchesSearch = guest.name.toLowerCase().includes(search.toLowerCase()) ||
      guest.email.toLowerCase().includes(search.toLowerCase()) ||
      guest.roomNumber.toString().includes(search);

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading guests...</div>;
  }

  return (
    <div className="guest-list">
      <div className="guest-header">
        <h1>Guest Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/guests/add')}
        >
          + Add New Guest
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Guests
          </button>
          <button 
            className={`filter-btn ${filter === 'withRoommates' ? 'active' : ''}`}
            onClick={() => setFilter('withRoommates')}
          >
            With Roommates
          </button>
          <button 
            className={`filter-btn ${filter === 'withoutRoommates' ? 'active' : ''}`}
            onClick={() => setFilter('withoutRoommates')}
          >
            Single Occupancy
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="guest-stats">
        <div className="stat-item">
          <span className="stat-label">Total Guests:</span>
          <span className="stat-value">{guests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">With Roommates:</span>
          <span className="stat-value">
            {guests.filter(g => g.roommates && g.roommates.length > 0).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Single Occupancy:</span>
          <span className="stat-value">
            {guests.filter(g => !g.roommates || g.roommates.length === 0).length}
          </span>
        </div>
      </div>

      {/* Guest Grid */}
      {filteredGuests.length === 0 ? (
        <div className="no-guests">
          <p>No guests found</p>
        </div>
      ) : (
        <div className="guests-grid">
          {filteredGuests.map(guest => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onEdit={() => navigate(`/guests/edit/${guest.id}`)}
              onDelete={() => handleDelete(guest.id)}
              onView={() => navigate(`/guests/${guest.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestList;