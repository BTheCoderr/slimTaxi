-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Function to calculate fare based on distance and duration
CREATE OR REPLACE FUNCTION calculate_fare(
  distance_km DECIMAL,
  duration_min INTEGER,
  car_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  base_fare DECIMAL;
  per_km_rate DECIMAL;
  per_min_rate DECIMAL;
  distance_fare DECIMAL;
  time_fare DECIMAL;
  total_fare DECIMAL;
BEGIN
  -- Set rates based on car type
  CASE car_type
    WHEN 'economy' THEN
      base_fare := 5;
      per_km_rate := 1.5;
      per_min_rate := 0.2;
    WHEN 'comfort' THEN
      base_fare := 7;
      per_km_rate := 2;
      per_min_rate := 0.3;
    WHEN 'luxury' THEN
      base_fare := 10;
      per_km_rate := 3;
      per_min_rate := 0.4;
    ELSE
      RAISE EXCEPTION 'Invalid car type';
  END CASE;

  -- Calculate fare components
  distance_fare := distance_km * per_km_rate;
  time_fare := duration_min * per_min_rate;
  total_fare := base_fare + distance_fare + time_fare;

  -- Return fare breakdown
  RETURN json_build_object(
    'baseFare', base_fare,
    'distanceFare', distance_fare,
    'timeFare', time_fare,
    'total', total_fare
  );
END;
$$;

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION nearby_drivers(
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  location JSON,
  distance_meters DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    json_build_object(
      'lat', ST_Y(d.current_location::geometry),
      'lng', ST_X(d.current_location::geometry)
    ) as location,
    ST_Distance(
      d.current_location::geometry,
      ST_SetSRID(ST_MakePoint(pickup_lng, pickup_lat), 4326)::geography
    ) as distance_meters
  FROM
    profiles p
    JOIN driver_locations d ON p.id = d.driver_id
  WHERE
    p.user_type = 'driver'
    AND p.active = true
    AND d.available = true
    AND ST_DWithin(
      d.current_location::geometry,
      ST_SetSRID(ST_MakePoint(pickup_lng, pickup_lat), 4326)::geography,
      radius_meters
    )
  ORDER BY
    distance_meters ASC;
END;
$$;

-- Function to update driver location
CREATE OR REPLACE FUNCTION update_driver_location(
  driver_id UUID,
  lat DECIMAL,
  lng DECIMAL,
  is_available BOOLEAN DEFAULT true
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO driver_locations (
    driver_id,
    current_location,
    available,
    updated_at
  )
  VALUES (
    driver_id,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    is_available,
    NOW()
  )
  ON CONFLICT (driver_id)
  DO UPDATE SET
    current_location = ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    available = is_available,
    updated_at = NOW();
END;
$$; 