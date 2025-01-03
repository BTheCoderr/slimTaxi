import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import Map from '../components/Map';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { MAIN_COLOR } from "../common/sharedFunctions";
import { fetchSettings } from "../redux/actions/settingsActions";
import AuthTest from '../components/AuthTest';

const useStyles = makeStyles(theme => ({
  mapContainer: {
    width: '100%',
    height: 'calc(100vh - 64px)',
    position: 'relative'
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 1000
  },
  infoText: {
    marginBottom: 10
  }
}));

export default function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [center, setCenter] = useState([37.7749, -122.4194]); // Default to San Francisco
  const [zoom, setZoom] = useState(13);

  const auth = useSelector(state => state.auth);
  const settingsdata = useSelector(state => state.settingsdata);
  const bookingdata = useSelector(state => state.bookingdata) || { bookings: [] };
  const driverdata = useSelector(state => state.driverdata) || { drivers: [] };

  // Fetch initial data
  useEffect(() => {
    if (!settingsdata?.settings) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settingsdata?.settings]);

  // Update map center and zoom when settings change
  useEffect(() => {
    if (settingsdata?.settings?.center) {
      setCenter([
        settingsdata.settings.center.lat,
        settingsdata.settings.center.lng
      ]);
      if (settingsdata.settings.zoom) {
        setZoom(settingsdata.settings.zoom);
      }
    }
  }, [settingsdata?.settings]);

  // Fetch data when auth profile changes
  useEffect(() => {
    if (auth?.profile?.uid) {
      dispatch(api.fetchBookings());
      dispatch(api.fetchDrivers());
      dispatch(api.fetchUsers());
    }
  }, [auth?.profile?.uid, dispatch]);

  // Update local state when data changes
  useEffect(() => {
    if (bookingdata?.bookings) {
      setBookings(bookingdata.bookings);
    }
  }, [bookingdata?.bookings]);

  useEffect(() => {
    if (driverdata?.drivers) {
      const activeDrivers = driverdata.drivers.filter(driver => 
        driver?.approved && driver?.driverActiveStatus
      );
      setDrivers(activeDrivers);
    }
  }, [driverdata?.drivers]);

  const createMarkers = useCallback(() => {
    const markers = [];

    // Add driver markers
    drivers.forEach(driver => {
      if (driver?.location) {
        markers.push({
          lat: driver.location.lat,
          lng: driver.location.lng,
          type: 'driver',
          data: driver,
          popup: `${t('driver')}: ${driver.firstName} ${driver.lastName}`
        });
      }
    });

    // Add active booking markers
    bookings.forEach(booking => {
      if (booking?.status === 'STARTED' || booking?.status === 'ACCEPTED') {
        if (booking?.pickup) {
          markers.push({
            lat: booking.pickup.lat,
            lng: booking.pickup.lng,
            type: 'pickup',
            data: booking,
            popup: `${t('pickup')}: ${booking.pickup.add}`
          });
        }
        if (booking?.drop) {
          markers.push({
            lat: booking.drop.lat,
            lng: booking.drop.lng,
            type: 'drop',
            data: booking,
            popup: `${t('drop')}: ${booking.drop.add}`
          });
        }
      }
    });

    return markers;
  }, [drivers, bookings, t]);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  if (auth?.loading || settingsdata?.loading) {
    return <CircularLoading />;
  }

  return (
    <div className={classes.mapContainer}>
      <AuthTest />
      <Map
        center={center}
        zoom={zoom}
        markers={createMarkers()}
        onMarkerClick={handleMarkerClick}
      />
      {selectedMarker && (
        <div className={classes.infoContainer}>
          <Typography variant="h6" style={{ color: MAIN_COLOR, marginBottom: 10 }}>
            {selectedMarker.type === 'driver' ? t('driver_info') : t('booking_info')}
          </Typography>
          {selectedMarker.type === 'driver' ? (
            <>
              <Typography className={classes.infoText}>
                {t('name')}: {selectedMarker.data.firstName} {selectedMarker.data.lastName}
              </Typography>
              <Typography className={classes.infoText}>
                {t('phone')}: {selectedMarker.data.mobile}
              </Typography>
              <Typography className={classes.infoText}>
                {t('car_number')}: {selectedMarker.data.carNumber}
              </Typography>
            </>
          ) : (
            <>
              <Typography className={classes.infoText}>
                {t('booking_id')}: {selectedMarker.data.id}
              </Typography>
              <Typography className={classes.infoText}>
                {t('status')}: {selectedMarker.data.status}
              </Typography>
              <Typography className={classes.infoText}>
                {selectedMarker.type === 'pickup' ? t('pickup') : t('drop')}: {selectedMarker.data[selectedMarker.type].add}
              </Typography>
            </>
          )}
        </div>
      )}
    </div>
  );
}