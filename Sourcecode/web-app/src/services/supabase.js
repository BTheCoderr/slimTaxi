import { supabase } from '../config/SupabaseConfig';

// Auth functions
export const auth = {
  signUp: async ({ email, password, ...data }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: data.firstName + ' ' + data.lastName,
          phone: data.mobile,
          user_type: data.usertype || 'customer'
        }
      }
    });
    if (error) throw error;
    return authData;
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  }
};

// Database functions
export const db = {
  // Profile operations
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
    return data;
  },

  // Vehicle operations
  getVehicles: async (driverId) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('driver_id', driverId);
    if (error) throw error;
    return data;
  },

  addVehicle: async (vehicleData) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData]);
    if (error) throw error;
    return data;
  },

  // Ride operations
  createRide: async (rideData) => {
    const { data, error } = await supabase
      .from('rides')
      .insert([rideData]);
    if (error) throw error;
    return data;
  },

  getRides: async (userId, userType = 'rider') => {
    const column = userType === 'rider' ? 'rider_id' : 'driver_id';
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq(column, userId);
    if (error) throw error;
    return data;
  },

  updateRideStatus: async (rideId, status) => {
    const { data, error } = await supabase
      .from('rides')
      .update({ status })
      .eq('id', rideId);
    if (error) throw error;
    return data;
  }
}; 