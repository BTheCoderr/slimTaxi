import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://eakfilddkferkswvzpkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVha2ZpbGRka2Zlcmtzd3Z6cGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4Nzc3NjIsImV4cCI6MjA1MTQ1Mzc2Mn0.O-EH9J5RQxODUno6sEc9B9NyeG679R-Lht7Cj6eIvKA';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  }
};

// Database functions
export const db = {
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
  }
}; 