// services/auth.js

const API_URL = 'http://localhost:8080/api';

// Login function
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const token = await response.text();
            if (token.includes('Rashid')) {
                localStorage.setItem('token', 'Rashid');
                localStorage.setItem('lastLogin', new Date().toISOString());
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
};

// Get token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastLogin');
    // Optional: Call backend logout endpoint if you have one
    // fetch(`${API_URL}/admin/logout`, { method: 'POST' });
};

// Check if authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token === 'Rashid'; // Your token value
};

// Validate token with backend
export const validateToken = async () => {
    try {
        const token = getToken();
        if (!token) return false;
        
        const response = await fetch(`${API_URL}/admin/validate-token`, {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};