import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { rideId } = await req.json();
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("rider_rides")
      .insert({ ride_id: rideId, rider_id: user.id });

    if (error) return NextResponse.json({ error: error.message || "Failed to join ride" }, { status: 400 });
    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
