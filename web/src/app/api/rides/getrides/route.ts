import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: links, error: linksError } = await supabase
      .from("rider_rides")
      .select("ride_id")
      .eq("rider_id", user.id);

    if (linksError) {
      return NextResponse.json( { error: linksError.message || "Failed to load rider_rides" }, { status: 500 } );
    }

    const rideIds = (links ?? []).map((row) => row.ride_id);

    if (rideIds.length === 0) {

      return NextResponse.json([], { status: 200 });
    }

    const { data: rides, error: ridesError } = await supabase
      .from("rides")
      .select("id, pickup_address, destination_address, seats, started_at, created_at")
      .in("id", rideIds)
      .order("created_at", { ascending: false });

    if (ridesError) {
      return NextResponse.json( { error: ridesError.message || "Failed to load rides" }, { status: 500 } );
    }

    return NextResponse.json(rides , { status: 200 });
  } catch (err: any) {
    return NextResponse.json( { error: err.message || "Server error" }, { status: 500 } );
  }
}
