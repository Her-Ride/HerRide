import { NextResponse } from "next/server";
import { googleClient, GOOGLE_MAPS_API_KEY } from "@/lib/google";
import { geocodeQuery } from "@/lib/validate";

export async function GET(req: Request) {
  console.log("SERVER KEY:", process.env.GOOGLE_MAPS_SERVER_KEY);
  const url = new URL(req.url);
  const parsed = geocodeQuery.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { address } = parsed.data;
  try {
    const { data } = await googleClient.geocode({ params: { address, key: GOOGLE_MAPS_API_KEY } });
    return NextResponse.json(data); 
  } catch (e: any) {
    return NextResponse.json({ error: e?.response?.data || e?.message || "Geocode failed" }, { status: 500 });
  }
}
