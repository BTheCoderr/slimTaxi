import {
  FETCH_DRIVERS_EARNING,
  FETCH_DRIVERS__EARNING_SUCCESS,
  FETCH_DRIVERS__EARNING_FAILED,
} from "../store/types";
import store from '../store/store';
import { supabase } from '../services/supabase';

export const fetchDriverEarnings = () => async (dispatch) => {
  dispatch({
    type: FETCH_DRIVERS_EARNING,
    payload: null
  });

  try {
    const userInfo = store.getState().auth.profile;

    // Get settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (settingsError) throw settingsError;

    // Get completed rides for the driver
    const { data: rides, error: ridesError } = await supabase
      .from('rides')
      .select(`
        *,
        driver:driver_id(
          id,
          first_name,
          last_name,
          vehicle_number
        )
      `)
      .eq('driver_id', userInfo.uid)
      .in('status', ['PAID', 'COMPLETE'])
      .order('created_at', { ascending: false });

    if (ridesError) throw ridesError;

    if (rides && rides.length > 0) {
      const monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const renderobj = {};

      rides.forEach(ride => {
        if (ride.driver_share !== undefined) {
          const bdt = new Date(ride.created_at);
          const uniqueKey = `${bdt.getFullYear()}_${bdt.getMonth()}_${ride.driver_id}`;

          if (renderobj[uniqueKey] && renderobj[uniqueKey].driverShare > 0) {
            renderobj[uniqueKey].driverShare = (parseFloat(renderobj[uniqueKey].driverShare) + parseFloat(ride.driver_share)).toFixed(settings.decimal);
            renderobj[uniqueKey].total_rides += 1;
          } else {
            renderobj[uniqueKey] = {
              dated: ride.created_at,
              year: bdt.getFullYear(),
              month: bdt.getMonth(),
              monthsName: monthsName[bdt.getMonth()],
              driverName: `${ride.driver.first_name} ${ride.driver.last_name}`,
              driverShare: parseFloat(ride.driver_share).toFixed(settings.decimal),
              driverVehicleNo: ride.driver.vehicle_number,
              driverUId: ride.driver_id,
              uniqueKey: uniqueKey,
              total_rides: 1
            };
          }
        }
      });

      const arr = Object.keys(renderobj).map(i => ({
        ...renderobj[i],
        driverShare: parseFloat(renderobj[i].driverShare).toFixed(settings.decimal)
      }));

      dispatch({
        type: FETCH_DRIVERS__EARNING_SUCCESS,
        payload: arr
      });

      // Set up real-time subscription for new earnings
      const subscription = supabase
        .channel('driver_earnings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rides',
            filter: `driver_id=eq.${userInfo.uid}`
          },
          () => {
            // Refresh earnings when there are changes
            dispatch(fetchDriverEarnings());
          }
        )
        .subscribe();

      // Store subscription for cleanup
      store.dispatch({
        type: 'STORE_SUBSCRIPTION',
        payload: { id: 'driver_earnings', subscription }
      });

    } else {
      dispatch({
        type: FETCH_DRIVERS__EARNING_FAILED,
        payload: "No data available."
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_DRIVERS__EARNING_FAILED,
      payload: error.message
    });
  }
};

