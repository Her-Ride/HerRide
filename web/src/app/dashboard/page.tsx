"use client";

import React, { useState } from "react";
import { MapPin, CarFront, Crosshair } from "lucide-react";
import Map from "@/components/Map";

type LatLng = {
  lat: number;
  lng: number;
};

export default function DashboardPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationBrowse, setDestinationBrowse] = useState("");
  const [seats, setSeats] = useState("");
  const [rides, setRides] = useState<any[]>([]);

  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocatingPickup, setIsLocatingPickup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickup || !destination) {
      setIsError(true);
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      
      const res = await fetch("/api/rides/newride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: pickup,
          destinationAddress: destination,
          seats: seats ? Number(seats) : null,
          destinationLat: mapCenter?.lat ?? null,
          destinationLng: mapCenter?.lng ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Create ride error:", data);
        setIsError(true);
        setErrorMessage(data.error || "Failed to create ride");
        return;
      }

      
      const newRide = { id: Date.now(), pickup, destination, seats };
      setRides((prev) => [...prev, newRide]);

      setPickup("");
      setDestination("");
      setSeats("");

      setIsSuccess(true);
      setSuccessMessage("Ride requested successfully!");
    } catch (err) {
      console.error(err);
      setIsError(true);
      setErrorMessage("Something went wrong creating the ride.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleShowDestinationOnMap = async () => {
    if (!destination) {
      setIsError(true);
      setErrorMessage("Enter a destination first.");
      return;
    }

    try {
      setIsLocating(true);

      const res = await fetch(
        `/api/maps/geocode?address=${encodeURIComponent(destination)}`
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Geocode error:", data);
        setIsError(true);
        setErrorMessage("Unable to locate destination.");
        return;
      }

      const loc = data?.results?.[0]?.geometry?.location;

      if (!loc) {
        setIsError(true);
        setErrorMessage("No location found for that address.");
        return;
      }

      setMapCenter({ lat: loc.lat, lng: loc.lng });
    } catch (err) {
      console.error(err);
      setIsError(true);
      setErrorMessage("Something went wrong looking up that address.");
    } finally {
      setIsLocating(false);
    }
  };

  const handleUseCurrentLocationForPickup = async () => {
    if (!navigator.geolocation) {
      setIsError(true);
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
    try {
      setIsLocatingPickup(true);
      const resolver = async (latitude: number, longitude: number) => {
        const res = await fetch(`/api/maps/reverse?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Unable to resolve your location.");
        const addr = data?.results?.[0]?.formatted_address || "Current location";
        setPickup(addr);
        setMapCenter({ lat: latitude, lng: longitude });
      };
      const attemptGetPos = (opts: PositionOptions) => new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, opts);
      });

      try {
        // First attempt with high accuracy
        const pos = await attemptGetPos({ enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 });
        await resolver(pos.coords.latitude, pos.coords.longitude);
      } catch (err: any) {
        const code = err?.code;
        if (code === 1) {
          setIsError(true);
          setErrorMessage("Permission denied. Please allow location access in your browser settings and retry.");
          return;
        }
        if (code === 2 || code === 3) {
          // Second attempt with lower accuracy
          try {
            const pos2 = await attemptGetPos({ enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 });
            await resolver(pos2.coords.latitude, pos2.coords.longitude);
          } catch (err2: any) {
            const msg = err2?.message || (code === 2 ? "Position unavailable" : "Location timeout");
            setIsError(true);
            setErrorMessage(`${msg}. Please check GPS, network, or try again.`);
          }
        } else {
          setIsError(true);
          setErrorMessage(err?.message || "Unknown error acquiring position.");
        }
      }
    } finally {
      setIsLocatingPickup(false);
    }
  };



  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
      {isError && (
        <div className="w-[90%] max-w-5xl mx-auto mt-6 bg-red-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => { setIsError(false); setErrorMessage(""); }}
              className="text-white/80 hover:text-white"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="w-[90%] max-w-5xl mx-auto mt-6 bg-green-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
            <button
              onClick={() => { setIsSuccess(false); setSuccessMessage(""); }}
              className="text-white/80 hover:text-white text-lg leading-none"
              aria-label="Dismiss success"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Main card */}
      <div className="w-[90%] max-w-5xl bg-black/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="font-[Aboreto] text-3xl md:text-4xl mb-8 text-center tracking-wider">
          HerRide Dashboard 
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side: Request a Ride */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-5 shadow-lg"
          >
            <h2 className="font-[Aboreto] text-2xl text-pink-300 mb-2">
              Request A Ride
            </h2>

            {/* Pickup */}
            <div>
              <label className="block text-sm mb-1 text-pink-200">
                Pickup Location
              </label>
              <div className="flex items-center bg-white/20 rounded-md px-3 relative">
                <MapPin size={18} className="text-pink-300 mr-2" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300 py-2 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocationForPickup}
                  disabled={isLocatingPickup}
                  className="absolute right-2 inset-y-0 my-auto h-8 px-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md flex items-center gap-1 disabled:opacity-60"
                  aria-label="Use current location"
                >
                  <Crosshair size={14} />
                  {isLocatingPickup ? "Locating" : ""}
                </button>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm mb-1 text-pink-200">
                Destination
              </label>
              <div className="flex items-center bg-white/20 rounded-md px-3">
                <MapPin size={18} className="text-pink-300 mr-2" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300 py-2"
                  required
                />
              </div>
            </div>

            {/* Seats */}
            <div>
              <label className="block text-sm mb-1 text-pink-200">
                Available Seats
              </label>
              <div className="flex items-center bg-white/20 rounded-md px-3">
                <CarFront size={18} className="text-pink-300 mr-2" />
                <input
                  type="number"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  placeholder="Number of seats"
                  min="1"
                  className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300 py-2"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition"
            >
              Request a Ride
            </button>
          </form>

              {/* Right side: Browse Rides with map */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              <h2 className="font-[Aboreto] text-2xl text-pink-300 mb-3">
               Browse Rides
              </h2>

              <input
              type="text"
                placeholder="Enter destination to browse rides"
                className="w-full bg-white/20 text-white placeholder-gray-300 p-2 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={destinationBrowse}
                onChange={(e) => setDestinationBrowse(e.target.value)}
              />

              <button
                type="button"
                onClick={handleShowDestinationOnMap}
                disabled={isLocating}
                className="w-full mb-4 bg-white/20 text-white text-sm py-2 rounded-md hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isLocating ? "Locating..." : "Show destination on map"}
              </button>

              {/* Map area */}
              <Map center={mapCenter || undefined} />

              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition">
                Browse Rides
              </button>
            </div>

        {/* Show submitted rides */}
        {rides.length > 0 && (
          <div className="mt-10 bg-white/10 p-6 rounded-xl">
            <h3 className="font-[Aboreto] text-pink-300 mb-3 text-center">
              Your Ride Requests
            </h3>
            <div className="space-y-3 text-gray-200">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="border-b border-white/20 pb-2 text-sm"
                >
                  <p>
                    <strong>From:</strong> {ride.pickup}
                  </p>
                  <p>
                    <strong>To:</strong> {ride.destination}
                  </p>
                  <p>
                    <strong>Seats:</strong> {ride.seats}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}