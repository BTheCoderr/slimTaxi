import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: {
    center: {
      lat: 37.7749, // Default to San Francisco
      lng: -122.4194
    },
    zoom: 13,
    defaultCurrency: 'USD',
    decimal: 2,
    bonus: 0,
    otp_secure: false,
    email_verify: false,
    CompanyName: 'SlimTaxi',
    CompanyWebsite: '',
    CompanyEmail: '',
    CompanyPhone: '',
    CompanyAddress: '',
    CompanyTerms: '',
    CompanyPrivacyPolicy: '',
    loading: false,
    error: null
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
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

export const { setSettings, setLoading, setError } = settingsSlice.actions;

export default settingsSlice.reducer; 