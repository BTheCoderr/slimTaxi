-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  phone text,
  is_driver boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create vehicles table
create table vehicles (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references profiles(id) on delete cascade not null,
  make text not null,
  model text not null,
  year integer not null,
  license_plate text not null,
  vehicle_type text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create rides table
create table rides (
  id uuid default uuid_generate_v4() primary key,
  rider_id uuid references profiles(id) not null,
  driver_id uuid references profiles(id),
  vehicle_id uuid references vehicles(id),
  pickup_location jsonb not null,
  dropoff_location jsonb not null,
  status text not null default 'pending',
  fare decimal(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create saved_locations table
create table saved_locations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  location jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS policies
-- Profiles: Users can only read and update their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Vehicles: Drivers can manage their vehicles, riders can view
create policy "Drivers can manage own vehicles"
  on vehicles for all
  using ( auth.uid() = driver_id );

create policy "Everyone can view vehicles"
  on vehicles for select
  to authenticated
  using ( true );

-- Rides: Users can see their own rides
create policy "Users can view own rides"
  on rides for select
  using ( auth.uid() = rider_id or auth.uid() = driver_id );

create policy "Users can create rides"
  on rides for insert
  with check ( auth.uid() = rider_id );

create policy "Users can update own rides"
  on rides for update
  using ( auth.uid() = rider_id or auth.uid() = driver_id );

-- Saved locations: Users can manage their saved locations
create policy "Users can manage own saved locations"
  on saved_locations for all
  using ( auth.uid() = user_id );
