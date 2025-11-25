"use client";

import { useEffect, useState } from "react";
import { Clock, Car, CheckCircle } from "lucide-react";

type Ride = {
  id: number;
  pickup_address: string | null;
  destination_address: string | null;
  seats: number | null;
  started_at: string | null;
  created_at: string;
};

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("/api/rides");

        const text = await res.text(); // 👈 read raw text first

        if (!text) {
          throw new Error("Empty response from /api/rides");
        }

        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON from /api/rides: " + text.slice(0, 100));
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to load rides");
        }

        setRides(data);
      } catch (err: any) {
        console.error("Error loading rides:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading your rides...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  if (!rides.length) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">You don&apos;t have any rides yet.</p>
      </main>
    );
  }

  const upcoming = rides.filter((r) => r.started_at === null);
  const completed = rides.filter((r) => r.started_at !== null);
  const ongoing: Ride[] = []; // you can define real logic later

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Rides
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Upcoming */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Upcoming</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            {upcoming.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No upcoming rides.
              </p>
            )}
            {upcoming.map((ride) => (
              <div
                key={ride.id}
                className="bg-gray-100 rounded-lg p-4 hover:bg-purple-50 transition"
              >
                <p>
                  <strong>From:</strong> {ride.pickup_address || "Unknown"}
                </p>
                <p>
                  <strong>To:</strong> {ride.destination_address || "Unknown"}
                </p>
                <p>
                  <strong>When:</strong>{" "}
                  {new Date(ride.created_at).toLocaleString()}
                </p>
                {ride.seats !== null && (
                  <p>
                    <strong>Seats:</strong> {ride.seats}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ongoing */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-6 h-6 text-pink-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Ongoing</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            {ongoing.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No rides in progress.
              </p>
            )}
          </div>
        </section>

        {/* Completed */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            {completed.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No completed rides yet.
              </p>
            )}
            {completed.map((ride) => (
              <div
                key={ride.id}
                className="bg-gray-100 rounded-lg p-4 hover:bg-green-50 transition"
              >
                <p>
                  <strong>From:</strong> {ride.pickup_address || "Unknown"}
                </p>
                <p>
                  <strong>To:</strong> {ride.destination_address || "Unknown"}
                </p>
                <p>
                  <strong>Started:</strong>{" "}
                  {ride.started_at
                    ? new Date(ride.started_at).toLocaleString()
                    : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
