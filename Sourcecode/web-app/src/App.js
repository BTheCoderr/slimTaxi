import React, { startTransition } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './i18n';

// Auth & Core Pages
import LoginPage from './views/LoginPage';
import RegistrationPage from './views/RegistrationPage';
import Dashboard from './views/Dashboard';
import AuthLoading from './views/AuthLoading';
import ProtectedRoute from './views/ProtectedRoute';

// Booking Related
import BookingPage from './views/BookingPage';
import AddBookings from './views/AddBookings';
import BookingDetails from './views/BookingDetails';
import BookingHistory from './views/BookingHistory';

// User Management
import Users from './views/Users';
import Riders from './views/Riders';
import Drivers from './views/Drivers';
import EditUser from './views/EditUser';
import MyProfile from './views/MyProfile';
import UserDocuments from './views/UserDocuments';

// Settings & Configuration
import Settings from './views/Settings';
import GeneralSettings from './views/GeneralSettings';
import PaymentSettings from './views/PaymentSettings';
import CarTypes from './views/CarTypes';
import EditCarType from './views/EditCarType';

// Wallet & Payments
import UserWallet from './views/UserWallet';
import AddMoney from './views/AddMoney';
import Withdraws from './views/Withdraws';
import DriverEarning from './views/DriverEarning';

// Additional Features
import Notifications from './views/Notifications';
import AddNotifications from './views/AddNotifications';
import Promos from './views/Promos';
import AboutUs from './views/AboutUs';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermCondition from './views/TermCondition';
import ContactUs from './views/ContactUs';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLoading />,
    errorElement: <div>Something went wrong!</div>
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  // Booking Routes
  {
    path: "/bookings",
    element: <ProtectedRoute><BookingPage /></ProtectedRoute>,
  },
  {
    path: "/add-booking",
    element: <ProtectedRoute><AddBookings /></ProtectedRoute>,
  },
  {
    path: "/booking/:id",
    element: <ProtectedRoute><BookingDetails /></ProtectedRoute>,
  },
  {
    path: "/booking-history",
    element: <ProtectedRoute><BookingHistory /></ProtectedRoute>,
  },
  // User Management Routes
  {
    path: "/users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
  {
    path: "/riders",
    element: <ProtectedRoute><Riders /></ProtectedRoute>,
  },
  {
    path: "/drivers",
    element: <ProtectedRoute><Drivers /></ProtectedRoute>,
  },
  {
    path: "/edit-user/:id",
    element: <ProtectedRoute><EditUser /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><MyProfile /></ProtectedRoute>,
  },
  {
    path: "/documents",
    element: <ProtectedRoute><UserDocuments /></ProtectedRoute>,
  },
  // Settings Routes
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/settings/general",
    element: <ProtectedRoute><GeneralSettings /></ProtectedRoute>,
  },
  {
    path: "/settings/payment",
    element: <ProtectedRoute><PaymentSettings /></ProtectedRoute>,
  },
  {
    path: "/car-types",
    element: <ProtectedRoute><CarTypes /></ProtectedRoute>,
  },
  {
    path: "/car-types/:id",
    element: <ProtectedRoute><EditCarType /></ProtectedRoute>,
  },
  // Wallet Routes
  {
    path: "/wallet",
    element: <ProtectedRoute><UserWallet /></ProtectedRoute>,
  },
  {
    path: "/add-money",
    element: <ProtectedRoute><AddMoney /></ProtectedRoute>,
  },
  {
    path: "/withdraws",
    element: <ProtectedRoute><Withdraws /></ProtectedRoute>,
  },
  {
    path: "/earnings",
    element: <ProtectedRoute><DriverEarning /></ProtectedRoute>,
  },
  // Additional Routes
  {
    path: "/notifications",
    element: <ProtectedRoute><Notifications /></ProtectedRoute>,
  },
  {
    path: "/add-notification",
    element: <ProtectedRoute><AddNotifications /></ProtectedRoute>,
  },
  {
    path: "/promos",
    element: <ProtectedRoute><Promos /></ProtectedRoute>,
  },
  // Static Pages
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms",
    element: <TermCondition />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  },
  basename: process.env.PUBLIC_URL
});

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}

export default App;