"use client";

import React, { useState } from "react";
import { MapPin, Calendar, CarFront } from "lucide-react";
import Map from "@/components/Map";

type LatLng = {
  lat: number;
  lng: number;
};

export default function DashboardPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [seats, setSeats] = useState("");
  const [rides, setRides] = useState<any[]>([]);

  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!pickup || !destination || !dateTime) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    setSubmitting(true);

    
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupAddress: pickup,
        destinationAddress: destination,
        seats: seats ? Number(seats) : null,
        dateTime, // datetime-local string
        destinationLat: mapCenter?.lat ?? null,
        destinationLng: mapCenter?.lng ?? null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Create ride error:", data);
      alert(data.error || "Failed to create ride");
      return;
    }

    
    const newRide = { id: Date.now(), pickup, destination, dateTime, seats };
    setRides((prev) => [...prev, newRide]);

    setPickup("");
    setDestination("");
    setDateTime("");
    setSeats("");

    alert("Ride request created!");
  } catch (err) {
    console.error(err);
    alert("Something went wrong creating the ride.");
  } finally {
    setSubmitting(false);
  }
};
const handleShowDestinationOnMap = async () => {
  if (!destination) {
    alert("Enter a destination first.");
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
      alert("Unable to locate destination.");
      return;
    }

    const loc = data?.results?.[0]?.geometry?.location;

    if (!loc) {
      alert("No location found for that address.");
      return;
    }

    setMapCenter({ lat: loc.lat, lng: loc.lng });
  } catch (err) {
    console.error(err);
    alert("Something went wrong looking up that address.");
  } finally {
    setIsLocating(false);
  }
};



  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
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
              <div className="flex items-center bg-white/20 rounded-md px-3">
                <MapPin size={18} className="text-pink-300 mr-2" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300 py-2"
                  required
                />
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
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
                    <strong>Date:</strong> {ride.dateTime}
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