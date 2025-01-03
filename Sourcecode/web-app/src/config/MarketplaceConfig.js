// Marketplace configuration
const marketplaceConfig = {
  url: process.env.REACT_APP_MARKETPLACE_URL || 'https://eakfilddkferkswvzpkt.supabase.co',
  apiVersion: 'v1',
  options: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export default marketplaceConfig; 