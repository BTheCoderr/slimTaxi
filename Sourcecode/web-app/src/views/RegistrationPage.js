import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/SupabaseConfig';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../common/sharedFunctions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  paper: {
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    textAlign: 'center',
    color: MAIN_COLOR,
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  button: {
    height: '48px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
  },
}));

export default function RegistrationPage() {
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
    usertype: 'customer',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.mobile,
            user_type: formData.usertype,
          },
        },
      });

      if (authError) throw authError;

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.mobile,
            user_type: formData.usertype,
          },
        ]);

      if (profileError) throw profileError;

      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Typography component="h1" variant="h5" className={classes.title}>
          {t('register')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label={t('first_name')}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label={t('last_name')}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label={t('email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label={t('password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label={t('mobile')}
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel>{t('user_type')}</InputLabel>
            <Select
              value={formData.usertype}
              name="usertype"
              onChange={handleChange}
            >
              <MenuItem value="customer">{t('customer')}</MenuItem>
              <MenuItem value="driver">{t('driver')}</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            {loading ? t('registering') : t('register')}
          </Button>
        </form>

        <Box className={classes.loginLink}>
          <Typography>
            {t('already_have_account')}{' '}
            <Button color="primary" onClick={() => navigate('/login')}>
              {t('login')}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 