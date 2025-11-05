"use client";

import React, { useState } from "react";
import { MapPin, Calendar, CarFront } from "lucide-react";

export default function DashboardPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [seats, setSeats] = useState("");
  const [rides, setRides] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRide = { id: Date.now(), pickup, destination, dateTime, seats };
    setRides((prev) => [...prev, newRide]);
    setPickup("");
    setDestination("");
    setDateTime("");
    setSeats("");

    alert("Ride request created!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
      {/* Main card */}
      <div className="w-[90%] max-w-5xl bg-black/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="font-[Aboreto] text-3xl md:text-4xl mb-8 text-center tracking-wider">
          PLAN A RIDE
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

            {/* Date & Time */}
            <div>
              <label className="block text-sm mb-1 text-pink-200">
                Date & Time
              </label>
              <div className="flex items-center bg-white/20 rounded-md px-3">
                <Calendar size={18} className="text-pink-300 mr-2" />
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-white py-2"
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
              className="w-full bg-white/20 text-white placeholder-gray-300 p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <div className="w-full h-64 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.911955769263!2d-73.996864!3d40.730610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af2ae3b5f9%3A0xf4b3c3947e6a6e0f!2sManhattan%2C%20NY!5e0!3m2!1sen!2sus!4v1688948899999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                loading="lazy"
                className="border-none"
              ></iframe>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition">
              Browse Rides
            </button>
          </div>
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
  );
}