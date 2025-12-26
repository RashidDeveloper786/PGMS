const API_URL = 'http://localhost:8080/api';

// Helper function to check authentication
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token === 'Rashid';
};

// Get auth header - redirects to landing page if not authenticated
const getAuthHeader = () => {
    if (!isAuthenticated()) {
        // Redirect to landing page if not authenticated
        window.location.href = '/';
        return null;
    }
    
    const token = localStorage.getItem('token') || 'Rashid';
    return {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
};

// Handle API response - check for 401/403
const handleResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('lastLogin');
        window.location.href = '/'; // Redirect to landing page
        throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Request failed with status ${response.status}`);
    }
    
    return response;
};

// Guest Management
export const getAllGuests = async () => {
    try {
        const headers = getAuthHeader();
        if (!headers) return [];
        
        const response = await fetch(`${API_URL}/guests/all`, {
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        const data = await checkedResponse.json();
        
        return Array.isArray(data) ? data.map(guest => ({
            ...guest,
            paymentStatus: guest.paymentStatus || 'pending',
            roommates: Math.random() > 0.5 ? [{ name: 'John Doe', phone: '9876543210' }] : []
        })) : [];
    } catch (error) {
        console.error('Error fetching guests:', error);
        if (error.message === 'Session expired. Please login again.') {
            throw error;
        }
        return [];
    }
};

export const getGuestById = async (id) => {
    try {
        const headers = getAuthHeader();
        if (!headers) return null;
        
        const response = await fetch(`${API_URL}/guests/guest/${id}`, {
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        const guest = await checkedResponse.json();
        
        return {
            ...guest,
            paymentStatus: guest.paymentStatus || 'pending',
            roommates: Math.random() > 0.5 ? [
                { name: 'Roommate 1', phone: '9876543210' },
                { name: 'Roommate 2', phone: '9876543211' }
            ] : []
        };
    } catch (error) {
        console.error('Error fetching guest:', error);
        if (error.message === 'Session expired. Please login again.') {
            throw error;
        }
        return null;
    }
};

export const addGuest = async (guestData) => {
    try {
        const headers = getAuthHeader();
        if (!headers) throw new Error('Not authenticated');
        
        const response = await fetch(`${API_URL}/guests/add?roomNumber=${guestData.roomNumber}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(guestData)
        });
        
        const checkedResponse = await handleResponse(response);
        return await checkedResponse.json();
    } catch (error) {
        console.error('Error adding guest:', error);
        throw error;
    }
};

export const updateGuest = async (id, guestData) => {
    try {
        const headers = getAuthHeader();
        if (!headers) throw new Error('Not authenticated');
        
        const response = await fetch(`${API_URL}/guests/update/${id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(guestData)
        });
        
        const checkedResponse = await handleResponse(response);
        return await checkedResponse.json();
    } catch (error) {
        console.error('Error updating guest:', error);
        throw error;
    }
};

export const deleteGuest = async (id) => {
    try {
        const headers = getAuthHeader();
        if (!headers) throw new Error('Not authenticated');
        
        const response = await fetch(`${API_URL}/guests/delete/${id}`, {
            method: 'DELETE',
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        return await checkedResponse.text();
    } catch (error) {
        console.error('Error deleting guest:', error);
        throw error;
    }
};

// Payment Management
export const updatePaymentStatus = async (guestId, month, status) => {
    try {
        const headers = getAuthHeader();
        if (!headers) throw new Error('Not authenticated');
        
        const response = await fetch(
            `${API_URL}/guests/${guestId}/payment-status?month=${encodeURIComponent(month)}&status=${encodeURIComponent(status)}`,
            {
                method: 'POST',
                headers: headers
            }
        );
        
        const checkedResponse = await handleResponse(response);
        return await checkedResponse.json();
    } catch (error) {
        console.error('Error updating payment:', error);
        throw error;
    }
};

// Room Management
export const getAvailableRooms = async () => {
    try {
        const headers = getAuthHeader();
        if (!headers) return [];
        
        const response = await fetch(`${API_URL}/guests/available-rooms`, {
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        const rooms = await checkedResponse.json();
        
        return Array.isArray(rooms) ? rooms.map(room => ({
            ...room,
            availableSlots: 2 - (room.guests?.length || 0),
            guests: room.guests || []
        })) : [];
    } catch (error) {
        console.error('Error fetching rooms:', error);
        if (error.message === 'Session expired. Please login again.') {
            throw error;
        }
        // Return mock data for development
        return Array.from({ length: 40 }, (_, i) => ({
            roomNumber: i + 101,
            availableSlots: Math.random() > 0.5 ? 1 : 2,
            guests: []
        }));
    }
};

export const getGuestsByRoom = async (roomNumber) => {
    try {
        const headers = getAuthHeader();
        if (!headers) return [];
        
        const response = await fetch(`${API_URL}/guests/${roomNumber}`, {
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        const guests = await checkedResponse.json();
        
        return Array.isArray(guests) ? guests : [];
    } catch (error) {
        console.error('Error fetching room guests:', error);
        if (error.message === 'Session expired. Please login again.') {
            throw error;
        }
        return [];
    }
};

// Dashboard
export const getDashboardStats = async () => {
    try {
        const headers = getAuthHeader();
        if (!headers) throw new Error('Not authenticated');
        
        const response = await fetch(`${API_URL}/guests/dashboard/stats`, {
            headers: headers
        });
        
        const checkedResponse = await handleResponse(response);
        const guests = await checkedResponse.json();
        
        const totalGuests = Array.isArray(guests) ? guests.length : 0;
        const pendingPayments = Array.isArray(guests) ? 
            guests.filter(g => g.paymentStatus === 'pending').length : 0;
        
        return {
            stats: {
                totalGuests,
                totalRooms: 40,
                occupiedRooms: Math.ceil(totalGuests / 2),
                availableRooms: 40 - Math.ceil(totalGuests / 2),
                pendingPayments
            },
            recentGuests: Array.isArray(guests) ? guests.slice(0, 5) : []
        };
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        throw error;
    }
};

// Check authentication status
export const checkAuth = () => {
    return isAuthenticated();
};

// Clear all data on logout
export const clearAllData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
};