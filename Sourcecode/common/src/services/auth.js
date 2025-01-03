import supabase from './supabaseClient';

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

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
}; 