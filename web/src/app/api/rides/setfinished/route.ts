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

    // Driver can finish a ride when started_at is not null and finished_at is null.
    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from("rides")
      .update({ finished_at: nowIso })
      .eq("id", rideId)
      .not("started_at", "is", null)
      .is("finished_at", null)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
