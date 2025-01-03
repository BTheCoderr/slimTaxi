import {
    FETCH_BOOKING_LOCATION,
    FETCH_BOOKING_LOCATION_SUCCESS,
    FETCH_BOOKING_LOCATION_FAILED,
    STOP_LOCATION_FETCH,
    STORE_ADRESSES
} from "../store/types";
import store from '../store/store';
import { supabase } from '../services/supabase';

export const saveTracking = async (bookingId, location) => {
    try {
        const { error } = await supabase
            .from('tracking')
            .insert([{
                booking_id: bookingId,
                location,
                timestamp: new Date()
            }]);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error saving tracking:', error);
    }
};

export const fetchBookingLocations = (bookingId) => async (dispatch) => {
    dispatch({
        type: FETCH_BOOKING_LOCATION,
        payload: bookingId,
    });

    try {
        // Get initial location
        const { data: initialLocation, error: initialError } = await supabase
            .from('tracking')
            .select('*')
            .eq('booking_id', bookingId)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (initialError) throw initialError;

        if (initialLocation) {
            dispatch({
                type: FETCH_BOOKING_LOCATION_SUCCESS,
                payload: initialLocation.location
            });
        }

        // Subscribe to real-time updates
        const subscription = supabase
            .channel(`tracking:${bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'tracking',
                    filter: `booking_id=eq.${bookingId}`
                },
                (payload) => {
                    dispatch({
                        type: FETCH_BOOKING_LOCATION_SUCCESS,
                        payload: payload.new.location
                    });
                }
            )
            .subscribe();

        // Store subscription for cleanup
        store.dispatch({
            type: 'STORE_SUBSCRIPTION',
            payload: { id: bookingId, subscription }
        });

    } catch (error) {
        dispatch({
            type: FETCH_BOOKING_LOCATION_FAILED,
            payload: store.getState().languagedata.defaultLanguage.location_fetch_error,
        });
    }
};

export const stopLocationFetch = (bookingId) => (dispatch) => {
    dispatch({
        type: STOP_LOCATION_FETCH,
        payload: bookingId,
    });

    // Get and cleanup subscription
    const subscription = store.getState().subscriptions?.[bookingId];
    if (subscription) {
        subscription.unsubscribe();
    }
};

export const saveUserLocation = async (location) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const { error } = await supabase.rpc('update_driver_location', {
            driver_id: user.id,
            lat: location.lat,
            lng: location.lng,
            is_available: true
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving user location:', error);
    }
};

export const storeAddresses = (data) => (dispatch) => {
    dispatch({
        type: STORE_ADRESSES,
        payload: data,
    });
};