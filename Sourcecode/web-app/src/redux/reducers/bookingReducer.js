import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { setBookings, setLoading, setError } = bookingSlice.actions;

export default bookingSlice.reducer; 