import React, { useState, useEffect } from 'react';
import { getAvailableRooms, getGuestsByRoom } from '../../services/guestService';
import './Rooms.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomGuests, setRoomGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const availableRooms = await getAvailableRooms();
      
      const allRooms = Array.from({ length: 40 }, (_, i) => {
        const roomNumber = i + 101;
        const availableRoom = availableRooms.find(r => r.roomNumber === roomNumber);
        
        return {
          roomNumber,
          availableSlots: availableRoom ? availableRoom.availableSlots : 0,
          isAvailable: availableRoom ? availableRoom.availableSlots > 0 : false,
          capacity: 2
        };
      });
      
      setRooms(allRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = async (roomNumber) => {
    setSelectedRoom(roomNumber);
    try {
      const guests = await getGuestsByRoom(roomNumber);
      setRoomGuests(guests);
    } catch (error) {
      console.error('Error fetching room guests:', error);
    }
  };

  const getRoomColor = (availableSlots) => {
    if (availableSlots === 2) return '#28a745';
    if (availableSlots === 1) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="room-management">
      <div className="room-header">
        <h1>Room Management</h1>
        <div className="room-stats">
          <span className="stat-total">Total Rooms: 40</span>
          <span className="stat-available">Available: {rooms.filter(r => r.isAvailable).length}</span>
          <span className="stat-occupied">Occupied: {rooms.filter(r => !r.isAvailable).length}</span>
        </div>
      </div>

      <div className="rooms-container">
        <div className="rooms-grid-large">
          {rooms.map(room => (
            <div 
              key={room.roomNumber}
              className={`room-card ${selectedRoom === room.roomNumber ? 'selected' : ''}`}
              onClick={() => handleRoomClick(room.roomNumber)}
              style={{ borderColor: getRoomColor(room.availableSlots) }}
            >
              <div className="room-card-header">
                <h3>Room #{room.roomNumber}</h3>
                <span 
                  className="room-status-badge"
                  style={{ backgroundColor: getRoomColor(room.availableSlots) }}
                >
                  {room.availableSlots === 2 ? 'Available' : 
                   room.availableSlots === 1 ? '1 Slot' : 'Full'}
                </span>
              </div>
              
              <div className="room-occupancy">
                <div className="occupancy-bar">
                  <div 
                    className="occupancy-fill"
                    style={{ 
                      width: `${(room.capacity - room.availableSlots) / room.capacity * 100}%`,
                      backgroundColor: getRoomColor(room.availableSlots)
                    }}
                  ></div>
                </div>
                <div className="occupancy-text">
                  {room.capacity - room.availableSlots} / {room.capacity} occupied
                </div>
              </div>
              
              <div className="room-info">
                <div className="info-row">
                  <span>Capacity:</span>
                  <span>{room.capacity} persons</span>
                </div>
                <div className="info-row">
                  <span>Available Slots:</span>
                  <span className={room.availableSlots > 0 ? 'text-success' : 'text-danger'}>
                    {room.availableSlots}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedRoom && (
          <div className="room-details">
            <div className="details-header">
              <h2>Room #{selectedRoom} Details</h2>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = `/guests/add?room=${selectedRoom}`}
                disabled={rooms.find(r => r.roomNumber === selectedRoom)?.availableSlots === 0}
              >
                Add Guest to Room
              </button>
            </div>
            
            {roomGuests.length > 0 ? (
              <div className="guests-list">
                <h3>Current Guests</h3>
                {roomGuests.map(guest => (
                  <div key={guest.id} className="guest-item">
                    <div className="guest-info">
                      <h4>{guest.name}</h4>
                      <p>Email: {guest.email}</p>
                      <p>Phone: {guest.phone}</p>
                      <p>Admit Date: {guest.admitDate}</p>
                    </div>
                    <div className="guest-actions">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => window.location.href = `/guests/edit/${guest.id}`}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-room">
                <p>No guests in this room</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = `/guests/add?room=${selectedRoom}`}
                >
                  Add First Guest
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;