import { supabase } from '../config/SupabaseConfig';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from('rides')
      .insert([{
        ...bookingData,
        status: 'PENDING',
        created_at: new Date(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all bookings for a user (either as rider or driver)
  getUserBookings: async (userId, userType) => {
    const column = userType === 'rider' ? 'rider_id' : 'driver_id';
    
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        rider:rider_id(
          id,
          first_name,
          last_name,
          mobile
        ),
        driver:driver_id(
          id,
          first_name,
          last_name,
          mobile
        )
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get nearby available drivers
  getNearbyDrivers: async (location, radius = 5000) => {
    // Using PostGIS for location-based query
    const { data, error } = await supabase
      .rpc('nearby_drivers', {
        pickup_lat: location.lat,
        pickup_lng: location.lng,
        radius_meters: radius
      });

    if (error) throw error;
    return data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, updates = {}) => {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status,
        ...updates,
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get a single booking by ID
  getBookingById: async (bookingId) => {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        rider:rider_id(
          id,
          first_name,
          last_name,
          mobile
        ),
        driver:driver_id(
          id,
          first_name,
          last_name,
          mobile
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to booking status changes
  subscribeToBooking: (bookingId, callback) => {
    const subscription = supabase
      .channel(`booking:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${bookingId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  // Calculate fare estimate
  calculateFare: async (distance, duration, carType) => {
    const { data, error } = await supabase
      .rpc('calculate_fare', {
        distance_km: distance,
        duration_min: duration,
        car_type: carType
      });

    if (error) throw error;
    return data;
  }
}; 