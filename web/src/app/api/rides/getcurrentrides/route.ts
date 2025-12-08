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

    const { data: riderLinks, error: linksErr } = await supabase
      .from("rider_rides")
      .select("ride_id")
      .eq("rider_id", user.id);

    if (linksErr) {
      return NextResponse.json({ error: linksErr.message }, { status: 400 });
    }

    const rideIds = (riderLinks || []).map((r) => r.ride_id);

    let rides: any[] = [];
    if (rideIds.length > 0) {
      const { data: rr, error: riderErr } = await supabase
        .from("rides")
        .select("*")
        .in("id", rideIds)
        .is("started_at", null)
        .order("created_at", { ascending: false });
        
      if (riderErr) {
        return NextResponse.json({ error: riderErr.message }, { status: 400 });
      }
      rides = rr || [];
    }

    return NextResponse.json({ rides }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
