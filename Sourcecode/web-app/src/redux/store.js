import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import settingsReducer from './reducers/settingsReducer';
import bookingReducer from './reducers/bookingReducer';
import driverReducer from './reducers/driverReducer';
import userReducer from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settingsdata: settingsReducer,
    bookingdata: bookingReducer,
    driverdata: driverReducer,
    usersdata: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 