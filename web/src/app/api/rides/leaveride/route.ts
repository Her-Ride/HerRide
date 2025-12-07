import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const { rideId } = body || {};
    if (!rideId) {
      return NextResponse.json(
        { error: "rideId is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // get ride info
    const { data: ride, error: rideErr } = await supabase
      .from("rides")
      .select("id, driver_id, started_at")
      .eq("id", rideId)
      .single();

    if (rideErr) {
      return NextResponse.json({ error: rideErr.message || "Failed to load ride" }, { status: 400 });
    }

    if (ride?.started_at != null) {
      return NextResponse.json({ error: "Cannot leave a ride that has already started" }, { status: 400 });
    }

    // delete rider_ride link
    const { error: delErr } = await supabase
        .from("rider_rides")
        .delete()
        .eq("ride_id", rideId)
        .eq("rider_id", user.id);

    if (delErr) {
        return NextResponse.json({ error: delErr.message || "Failed to leave ride" }, { status: 400 });
    }


    // if driver, unclaim ride if not started.
    if (ride?.driver_id === user.id) {
      const { error: updErr } = await supabase
        .from("rides")
        .update({ driver_id: null })
        .eq("id", rideId);

      if (updErr) {
        return NextResponse.json({ error: updErr.message || "Failed to unclaim ride" }, { status: 400 });
      }
    }

    // Delete ride if no one else is in it (silent error)
    const { error: delRideErr } = await supabase
      .from("rides")
      .delete()
      .eq("id", rideId);

    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
