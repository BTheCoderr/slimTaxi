import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drivers: [],
  loading: false,
  error: null
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setDrivers: (state, action) => {
      state.drivers = action.payload;
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

export const { setDrivers, setLoading, setError } = driverSlice.actions;

export default driverSlice.reducer; 