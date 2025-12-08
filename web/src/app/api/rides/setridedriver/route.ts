import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { rideId } = await req.json();
    if (!rideId) return NextResponse.json({ error: "rideId is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();

    // Driver can join and update a ride (driver_id and started_at is null)
    const { error } = await supabase
      .from("rides")
      .update({ driver_id: user.id })
      .eq("id", rideId)
      .is("driver_id", null)
      .is("started_at", null);

    if (error) return NextResponse.json({ error: error?.message || "Failed to set ride driver" }, { status: 400 });
    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
