import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  savedLocations: [],
  loading: false,
  error: null
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSavedLocations: (state, action) => {
      state.savedLocations = action.payload;
    },
    addSavedLocation: (state, action) => {
      state.savedLocations.push(action.payload);
    },
    removeSavedLocation: (state, action) => {
      state.savedLocations = state.savedLocations.filter(
        loc => loc.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearLocations: (state) => {
      state.currentLocation = null;
      state.savedLocations = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  setCurrentLocation,
  setSavedLocations,
  addSavedLocation,
  removeSavedLocation,
  setLoading,
  setError,
  clearLocations
} = locationSlice.actions;

export default locationSlice.reducer; 