DROP TABLE IF EXISTS users;

-- HerRide Users Table
CREATE TABLE users (
  clerk_id text not null default auth.jwt()->>'sub' unique PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial CHAR(1),
  phone_number TEXT,
  email TEXT NOT NULL,
  bio TEXT,
  profile_img_url TEXT,
  
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INT CHECK (vehicle_year > 1000 AND vehicle_year < 9999),
  vehicle_color TEXT,
  license_plate_number TEXT UNIQUE,
  seats_available INT DEFAULT 0 CHECK (seats_available >= 0),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT
  USING (true);

create policy "Users can insert own profile"
  on public.users for insert
  to authenticated
  with check ((select auth.jwt()->>'sub') = (clerk_id)::text);

create policy "Users can update own profile"
  on public.users for update
  to authenticated
  using ((select auth.jwt()->>'sub') = (clerk_id)::text)
  with check ((select auth.jwt()->>'sub') = (clerk_id)::text);

-- DEV-ONLY: Allow anonymous inserts to simplify local testing when a Supabase
-- session cookie has not been established yet. REMOVE before production.
-- create policy "DEV allow anonymous insert"
--   on "public"."users" for insert
--   to anon
--   with check (true);