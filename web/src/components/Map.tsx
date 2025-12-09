"use client";

import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { LatLng } from "@/lib/types";

type MapMarker = LatLng & { id?: number };
type MapProps = {
  center?: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker, index: number) => void;
};

const defaultCenter: LatLng = {
  lat: 40.73061,   // NYC-ish (you can change later)
  lng: -73.935242,
};

export default function Map({ center = defaultCenter, zoom = 12, markers = [], onMarkerClick }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  if (loadError) {
    return <div className="text-red-400 text-sm">Error loading map.</div>;
  }

  if (!isLoaded) {
    return <div className="text-white text-sm">Loading map…</div>;
  }

  return (
    <div className="w-full h-64 md:h-72 rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Show markers for available rides*/}
        {markers.length > 0 &&
          markers.map((m, idx) => (
            <Marker
              key={`${m.id ?? 'mk'}-${m.lat}-${m.lng}-${idx}`}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => onMarkerClick?.(m, idx)}
            />
          ))}
      </GoogleMap>
    </div>
  );
}
