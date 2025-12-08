"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { useUser } from "@clerk/nextjs";

// based on Google Maps API responses
type GeocodeResponse = {
	results: google.maps.GeocoderResult[];
	status: google.maps.GeocoderStatus;
} | null;

export default function DebugMapsPage() {
	// User information
	const { user } = useUser();
	const imageUrl = user?.imageUrl || null;

	// Load Google Maps API
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
	});

	// Ping
	const [ping, setPing] = useState<null | { ok: boolean; hasKey: boolean }>(null);
	const [pingLoading, setPingLoading] = useState(false);

	// Geocode
	const [address, setAddress] = useState("Times Square, New York, NY");
	const [geocode, setGeocode] = useState<GeocodeResponse>(null);
	const [geocodeLoading, setGeocodeLoading] = useState(false);

	// Reverse Geocode
	const [lat, setLat] = useState("40.7580");
	const [lng, setLng] = useState("-73.9855");
	const [reverse, setReverse] = useState<GeocodeResponse>(null);
	const [reverseLoading, setReverseLoading] = useState(false);

	// Directions
	const [origin, setOrigin] = useState("Times Square, New York, NY");
	const [destination, setDestination] = useState("Central Park, New York, NY");
	const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
	const [mode, setMode] = useState<"DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT">("DRIVING");
	const [dirLoading, setDirLoading] = useState(false);

	const firstGeocode = geocode?.results?.[0] || null; // Contains formatted_address and geometry/location
	const firstReverse = reverse?.results?.[0] || null; // Contains formatted_address
	const primaryLeg = directions?.routes?.[0]?.legs?.[0] || null; // Contains distance, duration, start_address, end_address

	// Helper function to safely extract lat/lng values
	const getLatLng = (location: google.maps.LatLng | google.maps.LatLngLiteral | undefined) => {
		if (!location) return { lat: 0, lng: 0 };

		if (typeof location.lat === 'function' && typeof location.lng === 'function') {
			return {
				lat: (location as google.maps.LatLng).lat(),
				lng: (location as google.maps.LatLng).lng()
			};
		}

		return {
			lat: location.lat as number,
			lng: location.lng as number
		};
	};

	const originCoords = primaryLeg ? getLatLng(primaryLeg.start_location) : null;
	const destinationCoords = primaryLeg ? getLatLng(primaryLeg.end_location) : null;

	async function doPing() {
		setPingLoading(true);
		try {
			const res = await fetch("/api/maps/ping");
			const data = await res.json();
			setPing(data);
		} catch (e) {
			setPing({ ok: false, hasKey: false });
		} finally {
			setPingLoading(false);
		}
	}

	async function doGeocode(e?: React.FormEvent) {
		e?.preventDefault();
		setGeocodeLoading(true);
		try {
			const url = new URL("/api/maps/geocode", window.location.origin);
			url.searchParams.set("address", address);
			const res = await fetch(url.toString());
			const data = await res.json();
			setGeocode(data);
		} finally {
			setGeocodeLoading(false);
		}
	}

	async function doReverse(e?: React.FormEvent) {
		e?.preventDefault();
		setReverseLoading(true);
		try {
			const url = new URL("/api/maps/reverse", window.location.origin);
			url.searchParams.set("lat", lat);
			url.searchParams.set("lng", lng);
			const res = await fetch(url.toString());
			const data = await res.json();
			setReverse(data);
		} finally {
			setReverseLoading(false);
		}
	}

	async function doDirections(e?: React.FormEvent) {
		e?.preventDefault();
		setDirLoading(true);
		
		// Switched to using DirectionsService instead of api/maps/directions
		try {
			const directionsService = new window.google.maps.DirectionsService();
			const travelMode = mode as google.maps.TravelMode;
			
			const result = await directionsService.route({
				origin: origin,
				destination: destination,
				travelMode: travelMode,
			});
			setDirections(result);
		} catch (error) {
			console.error("Directions service error:", error);
			setDirections(null);
		} finally {
			setDirLoading(false);
		}
	}

	const embedReady = Boolean(isLoaded);

	return (
		<main className="p-6 max-w-6xl mx-auto space-y-10">
			<h1 className="text-2xl font-bold">Google Maps Debug</h1>
			{!isLoaded && (
				<div className="rounded border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-900">
					Loading Google Maps API. Please ensure your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set correctly.
				</div>
			)}

			{/* Ping */}
			<section className="space-y-3">
				<div className="flex items-center gap-3">
					<h2 className="text-xl font-semibold">Ping</h2>
					<button
						onClick={doPing}
						className="rounded bg-black text-white px-3 py-1 text-sm disabled:opacity-50"
						disabled={pingLoading}
					>
						{pingLoading ? "Checking…" : "Check /api/maps/ping"}
					</button>
				</div>
				{ping && (
					<pre className="bg-gray-100 rounded p-3 overflow-auto text-xs">{JSON.stringify(ping, null, 2)}</pre>
				)}
			</section>

			{/* Geocoding */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Geocode (address &rarr; coordinates)</h2>
				<form onSubmit={doGeocode} className="flex flex-wrap items-center gap-2">
					<input
						className="border rounded px-3 py-2 min-w-[280px] flex-1"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Enter address"
					/>
					<button className="rounded bg-black text-white px-3 py-2 text-sm" type="submit" disabled={geocodeLoading}>
						{geocodeLoading ? "Geocoding…" : "Geocode"}
					</button>
				</form>
				{!!firstGeocode && (
					<div className="text-sm">
						<div className="mb-1">Formatted: <span className="font-mono">{firstGeocode.formatted_address}</span></div>
						<div>
							Location: {getLatLng(firstGeocode.geometry?.location).lat}, {getLatLng(firstGeocode.geometry?.location).lng}
						</div>
					</div>
				)}
				{geocode && (
					<details className="mt-2">
						<summary className="cursor-pointer text-sm text-gray-700">Raw response</summary>
						<pre className="bg-gray-100 rounded p-3 overflow-auto text-xs">{JSON.stringify(geocode, null, 2)}</pre>
					</details>
				)}
			</section>

			{/* Reverse Geocoding */}
			<section className="space-y-3">
				<h2 className="text-xl font-semibold">Reverse Geocode (coordinates &rarr; address)</h2>
				<form onSubmit={doReverse} className="flex flex-wrap items-center gap-2">
					<input
						className="border rounded px-3 py-2 w-40"
						value={lat}
						onChange={(e) => setLat(e.target.value)}
						placeholder="lat"
					/>
					<input
						className="border rounded px-3 py-2 w-40"
						value={lng}
						onChange={(e) => setLng(e.target.value)}
						placeholder="lng"
					/>
					<button className="rounded bg-black text-white px-3 py-2 text-sm" type="submit" disabled={reverseLoading}>
						{reverseLoading ? "Looking up…" : "Reverse"}
					</button>
				</form>
				{!!firstReverse && (
					<div className="text-sm">
						<div className="mb-1">Formatted: <span className="font-mono">{firstReverse.formatted_address}</span></div>
					</div>
				)}
				{reverse && (
					<details className="mt-2">
						<summary className="cursor-pointer text-sm text-gray-700">Raw response</summary>
						<pre className="bg-gray-100 rounded p-3 overflow-auto text-xs">{JSON.stringify(reverse, null, 2)}</pre>
					</details>
				)}
			</section>

			{/* Directions */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Directions (origin &rarr; destination)</h2>
				<form onSubmit={doDirections} className="flex flex-wrap items-center gap-2">
					<input
						className="border rounded px-3 py-2 min-w-60 flex-1"
						value={origin}
						onChange={(e) => setOrigin(e.target.value)}
						placeholder="Origin (address or 'lat,lng')"
					/>
					<input
						className="border rounded px-3 py-2 min-w-60 flex-1"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						placeholder="Destination (address or 'lat,lng')"
					/>
					<select
						className="border rounded px-2 py-2"
						value={mode}
						onChange={(e) => setMode(e.target.value as any)}
					>
						<option value="DRIVING">driving</option>
						<option value="WALKING">walking</option>
						<option value="BICYCLING">bicycling</option>
						<option value="TRANSIT">transit</option>
					</select>
					<button className="rounded bg-black text-white px-3 py-2 text-sm" type="submit" disabled={dirLoading}>
						{dirLoading ? "Requesting…" : "Get Directions JSON"}
					</button>
				</form>

				{primaryLeg && (
					<div className="text-sm space-y-1">
						<div><span className="font-semibold">Distance:</span> {primaryLeg.distance?.text}</div>
						<div><span className="font-semibold">Duration:</span> {primaryLeg.duration?.text}</div>
						<div className="opacity-70">Start: {primaryLeg.start_address} ({originCoords && `${originCoords.lat.toFixed(6)}, ${originCoords.lng.toFixed(6)}`})</div>
						<div className="opacity-70">End: {primaryLeg.end_address} ({destinationCoords && `${destinationCoords.lat.toFixed(6)}, ${destinationCoords.lng.toFixed(6)}`})</div>
					</div>
				)}
				{directions && (
					<details>
						<summary className="cursor-pointer text-sm text-gray-700">Raw response</summary>
						<pre className="bg-gray-100 rounded p-3 overflow-auto text-xs">{JSON.stringify(directions, null, 2)}</pre>
					</details>
				)}

				{/* Google Maps w/ Directions */}
				<div className="rounded border h-96">
					{embedReady && (
						<GoogleMap
							mapContainerStyle={{ width: "100%", height: "100%" }}
							center={{ lat: 40.7580, lng: -73.9855 }}
							zoom={13}
							options={{ 
								disableDefaultUI: false,
								clickableIcons: false,
								mapTypeId: "roadmap" as google.maps.MapTypeId
							}}
						>

							{directions && (
								<DirectionsRenderer
									directions={directions}
									options={{
										suppressMarkers: false,
										suppressInfoWindows: false,
									}}
								/>
							)} 
						</GoogleMap>
					)}
				</div>
			</section>

			{/* Notes */}
			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Notes</h2>
				<ul className="list-disc list-inside">
					<li>We will only use driving mode.</li>
					<li>We will store both address and latitude/longitude on rides</li>
					<li>Addresses are given by user, used for display and getting geocode</li>
					<li>Latitude and longtitude is used for mapping directions, and optionally to get detailed addresses</li>
				</ul>
			</section>

			<section className="space-y-2">
				<h2 className="text-xl font-semibold">Clerk test</h2>
				{imageUrl && (
				<div className="mt-4">
					<h3 className="text-lg font-semibold">Profile Image</h3>
					<Image src={imageUrl} alt="Profile" width={128} height={128} className="w-32 h-32 rounded-full object-cover" />
				</div>
				)}
				<h3 className="text-lg font-semibold">Username</h3>
				<p>{user?.username || "No username set"}</p>

			</section>


		</main>
	);
}