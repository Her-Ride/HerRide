import { Client } from "@googlemaps/google-maps-services-js";
export const googleClient = new Client({});
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;