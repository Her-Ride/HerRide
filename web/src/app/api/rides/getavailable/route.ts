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

    const { data: userRideLinks, error: linksErr } = await supabase
      .from("rider_rides")
      .select("ride_id")
      .eq("rider_id", user.id);

    if (linksErr) {
      return NextResponse.json({ error: ("1"+linksErr.message) }, { status: 500 });
    }

    const excludeIds = (userRideLinks ?? []).map((r) => r.ride_id);

    const { data, error } = await supabase
      .from("rides")
      .select(
        "id, pickup_address, destination_address, seats, started_at, finished_at, destination_lat, destination_lng, created_at, driver_id"
      )
      .is("started_at", null)
      .is("finished_at", null)
      // exclude rides where the user is already a rider
      .not("id", "in", excludeIds.length ? `(${excludeIds.join(",")})` : "(0)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rides: data ?? [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
