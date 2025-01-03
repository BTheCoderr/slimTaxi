// API configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL || 'http://localhost:3000';

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update'
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings/create',
    UPDATE: '/bookings/update',
    DELETE: '/bookings/delete'
  }
}; 