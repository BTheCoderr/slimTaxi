import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../common/services/supabase';
import { setUser } from '../redux/actions/authActions';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  Alert,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../common/sharedFunctions';
import GoogleIcon from '@mui/icons-material/Google';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: `linear-gradient(45deg, ${MAIN_COLOR} 30%, #FFD700 90%)`,
    padding: '20px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  paper: {
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  taxiIcon: {
    fontSize: '64px !important',
    color: MAIN_COLOR,
    marginBottom: '16px',
  },
  title: {
    textAlign: 'center',
    color: MAIN_COLOR,
    fontWeight: 'bold !important',
    marginBottom: '8px !important',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '24px !important',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },
  button: {
    height: '48px',
    borderRadius: '12px !important',
    fontSize: '16px !important',
    fontWeight: 'bold !important',
    textTransform: 'none !important',
  },
  googleButton: {
    backgroundColor: '#fff !important',
    color: '#757575 !important',
    border: '1px solid #ddd !important',
    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1) !important',
    },
  },
  divider: {
    margin: '20px 0 !important',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
  registerButton: {
    textTransform: 'none !important',
    fontWeight: 'bold !important',
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      dispatch(setUser({ ...data.user, profile }));
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      setCommonAlert({ open: true, msg: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <Box className={classes.logo}>
            <LocalTaxiIcon className={classes.taxiIcon} />
          </Box>
          
          <Typography variant="h4" className={classes.title}>
            {t('welcome_back')}
          </Typography>
          
          <Typography variant="subtitle1" className={classes.subtitle}>
            {t('login_to_continue')}
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {commonAlert.open && (
            <Alert severity="error" onClose={() => setCommonAlert({ open: false, msg: '' })}>
              {commonAlert.msg}
            </Alert>
          )}

          <form onSubmit={handleEmailLogin} className={classes.form}>
            <TextField
              className={classes.textField}
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
              fullWidth
            >
              {loading ? t('signing_in') : t('sign_in')}
            </Button>
          </form>

          <Divider className={classes.divider}>{t('or')}</Divider>

          <Button
            variant="contained"
            className={`${classes.button} ${classes.googleButton}`}
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            fullWidth
          >
            {t('continue_with_google')}
          </Button>

          <Box className={classes.registerLink}>
            <Typography variant="body2">
              {t('dont_have_account')}{' '}
              <Button 
                color="primary" 
                onClick={() => navigate('/register')}
                className={classes.registerButton}
              >
                {t('register')}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}