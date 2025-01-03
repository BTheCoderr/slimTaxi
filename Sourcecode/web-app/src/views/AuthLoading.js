import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../config/SupabaseConfig';
import { setUser, clearUser } from '../redux/actions/authActions';
import CircularLoading from '../components/CircularLoading';
import { Box, Typography } from '@mui/material';

export default function AuthLoading() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const checkUser = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        dispatch(setUser({ ...user, profile }));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setError(error.message);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;

            dispatch(setUser({ ...session.user, profile }));
            navigate('/dashboard');
          } catch (error) {
            console.error('Error fetching profile:', error);
            setError(error.message);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate, checkUser]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularLoading />
      {error && (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      )}
    </Box>
  );
}
