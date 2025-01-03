import {
    CONFIRM_BOOKING,
    CONFIRM_BOOKING_SUCCESS,
    CONFIRM_BOOKING_FAILED,
    CLEAR_BOOKING
} from "../store/types";
import { RequestPushMsg } from '../other/NotificationFunctions';
import store from '../store/store';
import { supabase } from '../services/supabase';
import { formatBookingObject } from '../other/sharedFunctions';

export const clearBooking = () => (dispatch) => {
    dispatch({
        type: CLEAR_BOOKING,
        payload: null,
    });
}

export const addBooking = (bookingData) => async (dispatch) => {
    dispatch({
        type: CONFIRM_BOOKING,
        payload: bookingData,
    });

    try {
        // Get settings
        const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .single();
        
        if (settingsError) throw settingsError;

        let data = await formatBookingObject(bookingData, settings);

        // Handle driver notifications
        if(bookingData.requestedDrivers){
            const drivers = bookingData.requestedDrivers;
            await Promise.all(Object.keys(drivers).map(async (uid) => {
                const { data: driverData } = await supabase
                    .from('profiles')
                    .select('push_token, platform')
                    .eq('id', uid)
                    .single();

                if (driverData?.push_token) {
                    RequestPushMsg(
                        driverData.push_token,
                        {
                            title: store.getState().languagedata.defaultLanguage.notification_title,
                            msg: store.getState().languagedata.defaultLanguage.new_booking_notification,
                            screen: 'DriverTrips',
                            channelId: settings.CarHornRepeat ? 'bookings-repeat' : 'bookings',
                            ios: driverData.platform === 'IOS'
                        }
                    );
                }
            }));
        }

        // Create booking
        const { data: booking, error: bookingError } = await supabase
            .from('rides')
            .insert([data])
            .select()
            .single();

        if (bookingError) throw bookingError;

        dispatch({
            type: CONFIRM_BOOKING_SUCCESS,
            payload: {
                booking_id: booking.id,
                mainData: {
                    ...data,
                    id: booking.id
                }
            }    
        });

        // Set up real-time subscription for this booking
        const subscription = supabase
            .channel(`booking:${booking.id}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'rides',
                filter: `id=eq.${booking.id}`
            }, payload => {
                // Handle booking updates
                console.log('Booking updated:', payload.new);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };

    } catch (error) {
        dispatch({
            type: CONFIRM_BOOKING_FAILED,
            payload: error.message,
        });
    }
};

