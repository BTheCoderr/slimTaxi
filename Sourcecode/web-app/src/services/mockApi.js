// Mock API service for development
import config from '../config/development';

// Mock data storage
const mockData = {
  users: [],
  bookings: [],
  drivers: [],
  vehicles: []
};

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      await delay(config.development.mockDelay);
      // In development, we'll still use Supabase for auth
      return { success: true, message: 'Use Supabase auth in development' };
    }
  },

  // User endpoints
  users: {
    getAll: async () => {
      await delay(config.development.mockDelay);
      return mockData.users;
    },
    getById: async (id) => {
      await delay(config.development.mockDelay);
      return mockData.users.find(user => user.id === id);
    },
    create: async (userData) => {
      await delay(config.development.mockDelay);
      const newUser = { ...userData, id: Date.now() };
      mockData.users.push(newUser);
      return newUser;
    }
  },

  // Booking endpoints
  bookings: {
    getAll: async () => {
      await delay(config.development.mockDelay);
      return mockData.bookings;
    },
    create: async (bookingData) => {
      await delay(config.development.mockDelay);
      const newBooking = { ...bookingData, id: Date.now() };
      mockData.bookings.push(newBooking);
      return newBooking;
    }
  }
};

export default mockApi; 