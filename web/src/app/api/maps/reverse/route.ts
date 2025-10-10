// web/src/app/api/maps/reverse/route.ts
import { NextResponse } from "next/server";
import { googleClient, GOOGLE_MAPS_API_KEY } from "@/lib/google";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const pretty = url.searchParams.get("pretty") === "1";

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required numbers" }, { status: 400 });
  }

  const { data } = await googleClient.reverseGeocode({
    params: { latlng: { lat, lng }, key: GOOGLE_MAPS_API_KEY },
  });

  const body = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  return new Response(body, { headers: { "content-type": "application/json" } });
}
