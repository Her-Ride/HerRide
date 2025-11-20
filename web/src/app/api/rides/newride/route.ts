import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user)
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    
    const body = await req.json();
    const {
      pickupAddress,
      destinationAddress,
      seats,
      destinationLat,
      destinationLng,
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

    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        driver_id: null, 
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        seats: seats ? Number(seats) : null,
        destination_lat: destinationLat ?? null,
        destination_lng: destinationLng ?? null,
        
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

