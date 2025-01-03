import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome_back: 'Welcome Back',
      login_to_continue: 'Sign in to continue',
      email: 'Email',
      password: 'Password',
      sign_in: 'Sign In',
      signing_in: 'Signing In...',
      or: 'OR',
      continue_with_google: 'Continue with Google',
      dont_have_account: "Don't have an account?",
      register: 'Register',
      driver_info: 'Driver Information',
      booking_info: 'Booking Information',
      name: 'Name',
      phone: 'Phone',
      car_number: 'Car Number',
      booking_id: 'Booking ID',
      status: 'Status',
      pickup: 'Pickup',
      drop: 'Drop',
      driver: 'Driver'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 