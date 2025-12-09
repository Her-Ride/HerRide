# HerRide 🚗💜

A safe, easy-to-use carpooling platform designed for women, connecting those traveling in the same direction to share rides, save costs, and build a supportive commuting community.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Features](#features)
- [API Routes](#api-routes)

---

## Overview

HerRide is a full-stack carpooling application that enables users to:
- **Create rides** and share them with other users
- **Join existing rides** as a rider or offer to drive
- **Real-time location tracking** using Google Maps integration
- **User authentication** via Clerk
- **Messaging** between ride participants
- **Secure database** with Supabase (PostgreSQL)

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 15.5](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Maps**: [Google Maps API](https://developers.google.com/maps) with React integration
- **UI Components**: [Lucide React](https://lucide.dev/) (icons)
- **Phone Input**: [react-phone-number-input](https://github.com/catamphetamine/react-phone-number-input)
- **Validation**: [Zod](https://zod.dev/)

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth Integration**: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)
- **Geolocation**: Google Maps Geocoding API

### Development Tools
- **Build Tool**: Turbopack (Next.js default)
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

---

## Project Structure

```
HerRide/
│
├── web/                          # Next.js frontend application
│   ├── public/                   # Static assets
│   │
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── api/              # API routes (server-side)
│   │   │   │   ├── rides/
│   │   │   │   │   ├── newride/          # POST - Create a new ride
│   │   │   │   │   ├── getrides/         # GET - Fetch user's rides
│   │   │   │   │   ├── getcurrentrides/  # GET - Get active rides
│   │   │   │   │   ├── joinride/         # POST - Join a ride
│   │   │   │   │   ├── leaveride/        # POST - Leave a ride
│   │   │   │   │   ├── setstarted/       # PUT - Mark ride as started
│   │   │   │   │   ├── setfinished/      # PUT - Mark ride as finished
│   │   │   │   │   ├── setridedriver/    # PUT - Set ride driver
│   │   │   │   │   └── removerider/      # DELETE - Remove rider
│   │   │   │   ├── maps/
│   │   │   │   │   ├── directions/       # GET - Get directions
│   │   │   │   │   ├── geocode/          # GET - Geocode address
│   │   │   │   │   ├── reverse/          # GET - Reverse geocode
│   │   │   │   │   └── ping/             # GET - Health check
│   │   │   │   └── users/
│   │   │   │       ├── newuser/          # POST - Create user profile
│   │   │   │       ├── getuser/          # GET - Get user details
│   │   │   │       ├── getuserpublic/    # GET - Get public profile
│   │   │   │       └── update/           # PUT - Update user
│   │   │   │
│   │   │   ├── dashboard/        # Main dashboard page
│   │   │   ├── rides/            # Browse all rides
│   │   │   ├── messages/         # Messaging interface
│   │   │   ├── profile/          # User profile
│   │   │   ├── login/            # Authentication
│   │   │   ├── about/            # About page
│   │   │   ├── contact/          # Contact page
│   │   │   ├── learn-more/       # Info page
│   │   │   └── debug/            # Debug page
│   │   │
│   │   ├── components/           # Reusable React components
│   │   │   ├── Header.tsx        # Navigation header
│   │   │   ├── Footer.tsx        # Footer component
│   │   │   ├── Map.tsx           # Google Maps integration
│   │   │   └── CreateUser.tsx    # User creation form
│   │   │
│   │   ├── lib/                  # Utility functions and libraries
│   │   │   ├── types.ts          # TypeScript type definitions
│   │   │   ├── validate.ts       # Validation utilities
│   │   │   ├── google.ts         # Google Maps client
│   │   │   └── supabase/
│   │   │       ├── client.ts     # Server-side Supabase client
│   │   │       └── server.ts     # Alternative server client
│   │   │
│   │   ├── middleware.ts         # Next.js middleware
│   │   ├── globals.css           # Global styles
│   │
│   ├── package.json              # Dependencies
│   ├── next.config.ts            # Next.js configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── postcss.config.mjs        # PostCSS configuration
│   ├── eslint.config.mjs         # ESLint configuration
│   └── next-env.d.ts             # TypeScript definitions
│
├── schemas/                      # Database schema files
│   ├── users.sql                 # Users table schema
│   └── rides.sql                 # Rides and rider_rides tables
│
├── .gitignore                    # Git ignore rules
├── LICENSE                       # Project license
├── package-lock.json             # Lock file
└── README.md                     # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- Accounts for:
  - [Supabase](https://supabase.com/) (PostgreSQL database)
  - [Clerk](https://clerk.com/) (Authentication)
  - [Google Cloud](https://console.cloud.google.com/) (Maps & Geocoding APIs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Her-Ride/HerRide.git
   cd HerRide
   ```

2. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Set up the database**
   - Log in to your Supabase project
   - Run the SQL scripts from `schemas/` folder:
     - Execute `schemas/users.sql`
     - Execute `schemas/rides.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the `web/` directory with the following variables:

```bash
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs (Static - Do not change)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Your API Keys

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Google Maps API
   - Geocoding API
   - Directions API
4. Create an API key in Credentials
5. Restrict the key to these APIs

#### Clerk
1. Sign up at [clerk.com](https://clerk.com/)
2. Create an application
3. Find keys in the "API Keys" section

#### Supabase
1. Create a project at [supabase.com](https://supabase.com/)
2. Go to Settings → API to find your URL and Anon Key
3. Make sure Row Level Security (RLS) policies are set up (included in schema files)

---

## Database Schema

### Users Table
Stores user profile information and vehicle details.

```
users (
  clerk_id: TEXT (PK),
  first_name: TEXT,
  last_name: TEXT,
  email: TEXT,
  phone_number: TEXT,
  vehicle_make: TEXT,
  vehicle_model: TEXT,
  seats_available: INT,
  ...
)
```

### Rides Table
Stores ride information created by drivers or riders.

```
rides (
  id: BIGINT (PK),
  driver_id: TEXT (FK → users.clerk_id),
  pickup_address: TEXT,
  pickup_lat/lng: DOUBLE PRECISION,
  destination_address: TEXT,
  destination_lat/lng: DOUBLE PRECISION,
  seats: INT,
  started_at: TIMESTAMP,
  finished_at: TIMESTAMP,
  created_at: TIMESTAMP
)
```

### Rider_Rides Table
Junction table linking riders to rides (many-to-many relationship).

```
rider_rides (
  ride_id: BIGINT (FK → rides.id),
  rider_id: TEXT (FK → users.clerk_id),
  PRIMARY KEY (ride_id, rider_id)
)
```

---

## Features

### Current Features
✅ User authentication via Clerk  
✅ User profile creation and management  
✅ Create new rides with pickup/destination  
✅ Browse available rides  
✅ Join/leave rides as a rider  
✅ Become a driver for a ride  
✅ Real-time location tracking with Google Maps  
✅ Messaging between ride participants  
✅ Ride status management (started, finished)  
✅ Remove riders from ride (driver only)  

### Planned Features
🔄 User ratings and reviews  
🔄 Payment integration  
🔄 Real-time notifications  
🔄 Advanced search filters  
🔄 Ride history and statistics  

---

## API Routes

### Rides Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/rides/newride` | Create a new ride |
| GET | `/api/rides/getrides` | Get rides linked to the signed-in user |
| GET | `/api/rides/getcurrentrides` | Get user's current (not finished) rides |
| GET | `/api/rides/getavailable` | Get available rides to join (not started/finished; excludes user's rides) |
| POST | `/api/rides/joinride` | Join an existing ride |
| POST | `/api/rides/leaveride` | Leave a ride |
| POST | `/api/rides/setstarted` | Mark ride as started |
| POST | `/api/rides/setfinished` | Mark ride as finished |
| POST | `/api/rides/setridedriver` | Set ride driver |
| POST | `/api/rides/removerider` | Remove a rider |

### Maps Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/maps/directions` | Get directions between two points (body: `{ origin, destination, mode }`) |
| GET | `/api/maps/geocode` | Convert address to coordinates (`?address=`) |
| GET | `/api/maps/reverse` | Convert coordinates to address (`?lat=&lng=`) |
| GET | `/api/maps/ping` | Health check |

### Users Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/newuser` | Create user profile |
| GET | `/api/users/getuser` | Get current signed-in user's details |
| POST | `/api/users/getuserpublic` | Get public user profile (body: `{ clerkId }`) |
| PATCH | `/api/users/update` | Update user profile (allowed fields only) |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, please reach out to the HerRide team or open an issue on GitHub.

