import supabase from './supabaseClient';

export const profileService = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  },

  createProfile: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    return data;
  }
}; 