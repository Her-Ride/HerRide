import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { rideId, riderClerkId } = await req.json();
    if (!rideId || !riderClerkId) {
      return NextResponse.json({ error: "rideId and riderClerkId are required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Driver deletes a rider from a ride
    const { error } = await supabase
      .from("rider_rides")
      .delete()
      .eq("ride_id", rideId)
      .eq("rider_id", riderClerkId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
