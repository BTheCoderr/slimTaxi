import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import Map from '../components/Map';
import { bookingService } from '../services/bookingService';
import { MAIN_COLOR } from '../common/sharedFunctions';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: '20px',
    paddingBottom: '20px',
  },
  paper: {
    padding: '20px',
    marginBottom: '20px',
  },
  mapContainer: {
    height: '400px',
    marginBottom: '20px',
  },
  formControl: {
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
  },
  fareEstimate: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
}));

export default function BookingPage() {
  const classes = useStyles();
  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  
  const [bookingData, setBookingData] = useState({
    pickup: null,
    dropoff: null,
    carType: '',
    notes: '',
  });
  const [fareEstimate, setFareEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [pointType, setPointType] = useState('pickup'); // 'pickup' or 'dropoff'

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const center = [position.coords.latitude, position.coords.longitude];
          setMapCenter(center);
          if (!bookingData.pickup) {
            setBookingData(prev => ({
              ...prev,
              pickup: { lat: center[0], lng: center[1] }
            }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [bookingData.pickup]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setBookingData(prev => ({
      ...prev,
      [pointType]: { lat, lng }
    }));
  };

  const handlePointTypeChange = (type) => {
    setPointType(type);
  };

  const handleInputChange = (e) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateEstimate = async () => {
    if (!bookingData.pickup || !bookingData.dropoff || !bookingData.carType) {
      setError(t('please_fill_all_fields'));
      return;
    }

    try {
      setLoading(true);
      // Calculate distance and duration (you'll need to implement this)
      const distance = 5; // Example distance in km
      const duration = 15; // Example duration in minutes
      
      const estimate = await bookingService.calculateFare(
        distance,
        duration,
        bookingData.carType
      );
      
      setFareEstimate(estimate);
      setError('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingData.pickup || !bookingData.dropoff || !bookingData.carType) {
      setError(t('please_fill_all_fields'));
      return;
    }

    try {
      setLoading(true);
      const booking = await bookingService.createBooking({
        rider_id: auth.user.id,
        pickup_location: bookingData.pickup,
        dropoff_location: bookingData.dropoff,
        car_type: bookingData.carType,
        notes: bookingData.notes,
        estimated_fare: fareEstimate?.total || 0,
      });

      // Subscribe to booking updates
      const unsubscribe = bookingService.subscribeToBooking(
        booking.id,
        (updatedBooking) => {
          // Handle booking updates
          console.log('Booking updated:', updatedBooking);
        }
      );

      // Clean up subscription on component unmount
      return () => {
        unsubscribe();
      };
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createMarkers = () => {
    const markers = [];
    
    if (bookingData.pickup) {
      markers.push({
        lat: bookingData.pickup.lat,
        lng: bookingData.pickup.lng,
        type: 'pickup',
        popup: t('pickup_location')
      });
    }
    
    if (bookingData.dropoff) {
      markers.push({
        lat: bookingData.dropoff.lat,
        lng: bookingData.dropoff.lng,
        type: 'dropoff',
        popup: t('dropoff_location')
      });
    }

    return markers;
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        {t('book_a_ride')}
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <div className={classes.mapContainer}>
              <Map
                center={mapCenter}
                zoom={13}
                markers={createMarkers()}
                onMapClick={handleMapClick}
              />
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('select_point_type')}</InputLabel>
                  <Select
                    value={pointType}
                    onChange={(e) => handlePointTypeChange(e.target.value)}
                  >
                    <MenuItem value="pickup">{t('pickup_location')}</MenuItem>
                    <MenuItem value="dropoff">{t('dropoff_location')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              {t('ride_details')}
            </Typography>

            <FormControl fullWidth className={classes.formControl}>
              <InputLabel>{t('car_type')}</InputLabel>
              <Select
                name="carType"
                value={bookingData.carType}
                onChange={handleInputChange}
              >
                <MenuItem value="economy">{t('economy')}</MenuItem>
                <MenuItem value="comfort">{t('comfort')}</MenuItem>
                <MenuItem value="luxury">{t('luxury')}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              name="notes"
              label={t('notes')}
              value={bookingData.notes}
              onChange={handleInputChange}
              className={classes.formControl}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={calculateEstimate}
              disabled={loading || !bookingData.pickup || !bookingData.dropoff || !bookingData.carType}
              className={classes.button}
            >
              {loading ? <CircularProgress size={24} /> : t('calculate_fare')}
            </Button>

            {fareEstimate && (
              <Box className={classes.fareEstimate}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('fare_estimate')}
                </Typography>
                <Typography>
                  {t('base_fare')}: ${fareEstimate.baseFare}
                </Typography>
                <Typography>
                  {t('distance_fare')}: ${fareEstimate.distanceFare}
                </Typography>
                <Typography>
                  {t('time_fare')}: ${fareEstimate.timeFare}
                </Typography>
                <Typography variant="h6" style={{ marginTop: '10px' }}>
                  {t('total')}: ${fareEstimate.total}
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              style={{ backgroundColor: MAIN_COLOR }}
              onClick={handleBooking}
              disabled={loading || !fareEstimate}
              className={classes.button}
            >
              {loading ? <CircularProgress size={24} /> : t('book_now')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 