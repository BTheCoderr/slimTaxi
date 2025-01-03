// Development configuration
const config = {
  // API endpoints
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  },
  
  // Auth configuration
  auth: {
    useSupabase: true, // We'll still use Supabase for auth in development
    tokenKey: 'slimtaxi-auth-token'
  },
  
  // Feature flags
  features: {
    useLocalStorage: true,
    enableMocking: true,
    debugMode: true
  },
  
  // Development tools
  development: {
    showDevTools: true,
    logRequests: true,
    mockDelay: 500 // Simulate network delay in ms
  }
};

export default config; 