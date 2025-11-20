import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Users } from "lucide-react";

// Server-side Supabase client using service role key
function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !serviceKey) {
    throw new Error("Supabase env vars are missing");
  }

  return createClient(url, serviceKey);
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    
    const body = await req.json();
    const {
      pickupAddress,
      destinationAddress,
      seats,
      dateTime,        
      destinationLat,
      destinationLng,
    } = body;

    if (!pickupAddress || !destinationAddress || !dateTime) {
      return NextResponse.json(
        {
          error:
            "pickupAddress, destinationAddress, and dateTime are required",
          received: body,
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        driver_id: null, 
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        seats: seats ? Number(seats) : null,
        destination_lat: destinationLat ?? null,
        destination_lng: destinationLng ?? null,
        
        created_at: new Date(dateTime).toISOString(),
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
        rider_id: userId,
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

