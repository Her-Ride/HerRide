import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'
import { googleClient, GOOGLE_MAPS_API_KEY } from '@/lib/google'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user)
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    
    const body = await req.json();
    const {
      pickupAddress,
      destinationAddress,
      seats,
      beDriver,
    } = body;

    if (!pickupAddress || !destinationAddress) {
      return NextResponse.json(
        {
          error:
            "pickupAddress, destinationAddress are required",
          received: body,
        },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient()

    let pickupLat: number | null = null;
    let pickupLng: number | null = null;
    let destinationLat: number | null = null;
    let destinationLng: number | null = null;

    { // Geocode pickup
      const { data } = await googleClient.geocode({ params: { address: pickupAddress, key: GOOGLE_MAPS_API_KEY } });
      const loc = data?.results?.[0]?.geometry?.location;
      if (!loc) {
        return NextResponse.json({ error: 'Pickup address could not be resolved', details: data }, { status: 400 });
      }
      pickupLat = Number(loc.lat);
      pickupLng = Number(loc.lng);
    }

    { // Geocode destination
      const { data } = await googleClient.geocode({ params: { address: destinationAddress, key: GOOGLE_MAPS_API_KEY } });
      const loc = data?.results?.[0]?.geometry?.location;
      if (!loc) {
        return NextResponse.json({ error: 'Destination address could not be resolved', details: data }, { status: 400 });
      }
      destinationLat = Number(loc.lat);
      destinationLng = Number(loc.lng);
    }

    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        driver_id: beDriver ? user.id : null, 
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        seats: seats ? Number(seats) : null,
        destination_lat: destinationLat,
        destination_lng: destinationLng,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
      })
      .select()
      .single();

    if (rideError || !ride) {
      console.error("Insert ride error:", rideError);
      return NextResponse.json(
        {
          error: rideError?.message || "Failed to create ride",
          details: rideError,
        },
        { status: 400 }
      );
    }
    const { error: linkError } = await supabase
      .from("rider_rides")
      .insert({
        ride_id: ride.id,
        rider_id: user.id,
      });

    if (linkError) {
      console.error("Insert rider_rides error:", linkError);
      return NextResponse.json(
        {
          error: linkError.message || "Ride created but failed to link rider",
          ride,
          details: linkError,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(ride, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/rides error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Server error",
      },
      { status: 500 }
    );
  }
}

