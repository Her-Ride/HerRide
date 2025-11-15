DROP TABLE IF EXISTS users;

-- HerRide Users Table
CREATE TABLE users (
  clerk_id text not null default auth.jwt()->>'sub' unique PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial CHAR(1),
  
  phone_number TEXT,
  email TEXT NOT NULL,
  share_email BOOLEAN NOT NULL DEFAULT false,
  share_phone BOOLEAN NOT NULL DEFAULT false,

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
  on public.users for insert to authenticated
  with check (clerk_id = (select auth.jwt()->>'sub'));

create policy "Users can update own profile"
  on public.users for update to authenticated
  using (clerk_id = (select auth.jwt()->>'sub'))
  with check (clerk_id = (select auth.jwt()->>'sub'));


-- User public view (needed for email/phone boolean)
DROP VIEW IF EXISTS public.user_public;
CREATE OR REPLACE VIEW public.user_public
WITH (security_invoker) AS
SELECT
  u.clerk_id,
  u.first_name,
  u.last_name,
  u.middle_initial,
  u.share_email,
  u.share_phone,
  CASE
    WHEN u.share_email OR u.clerk_id = (select auth.jwt()->>'sub') THEN u.email
    ELSE NULL
  END AS email,
  CASE
    WHEN u.share_phone OR u.clerk_id = (select auth.jwt()->>'sub') THEN u.phone_number
    ELSE NULL
  END AS phone_number,
  u.bio,
  u.profile_img_url,
  u.vehicle_make,
  u.vehicle_model,
  u.vehicle_year,
  u.vehicle_color,
  u.license_plate_number,
  u.seats_available,
  u.created_at
FROM public.users u;

REVOKE SELECT ON public.users FROM anon, authenticated;
GRANT SELECT ON public.user_public TO anon, authenticated;