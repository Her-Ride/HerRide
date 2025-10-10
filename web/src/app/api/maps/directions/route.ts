import { NextResponse } from "next/server";
import { googleClient, GOOGLE_MAPS_API_KEY } from "@/lib/google";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { origin, destination, mode = "driving" } = body;

  if (!origin || !destination) {
    return NextResponse.json({ error: "origin and destination are required" }, { status: 400 });
  }

  try {
    const { data } = await googleClient.directions({
      params: {
        origin,              // string "Queens, NY" OR { lat, lng }
        destination,         // same as above
        mode,                // "driving" | "walking" | "bicycling" | "transit"
        key: GOOGLE_MAPS_API_KEY,
        alternatives: false,
      },
    });
    return NextResponse.json(data); // look at routes[0].legs[0].distance / duration / steps
  } catch (e: any) {
    return NextResponse.json({ error: e?.response?.data || e?.message || "Directions failed" }, { status: 500 });
  }
}
