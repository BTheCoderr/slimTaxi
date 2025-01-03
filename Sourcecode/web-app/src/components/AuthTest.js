import React, { useEffect, useState } from 'react';
import { auth } from 'common/src/services/auth';
import { Button, Paper, Typography, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    padding: 20,
    minWidth: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  button: {
    marginTop: 16
  }
}));

const AuthTest = () => {
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await auth.signIn({
        email: 'bferrell514@gmail.com',
        password: 'your-password-here'  // You'll need to use the actual password
      });
      setUser(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" gutterBottom>
        Authentication Status
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user ? (
        <>
          <Typography variant="body1" gutterBottom>
            Logged in as: {user.email}
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleSignOut}
            disabled={loading}
            className={classes.button}
          >
            {loading ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </>
      ) : (
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSignIn}
          disabled={loading}
          className={classes.button}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      )}
    </Paper>
  );
};

export default AuthTest; 