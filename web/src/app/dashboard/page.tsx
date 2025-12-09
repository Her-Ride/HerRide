"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CarFront, Crosshair } from "lucide-react";
import Map from "@/components/Map";
import { LatLng, Ride } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationBrowse, setDestinationBrowse] = useState("");
  const [seats, setSeats] = useState("");
  const [beDriver, setBeDriver] = useState<boolean>(false);
  const [userRides, setUserRides] = useState<Ride[]>([]);

  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [mapPickupCenter, setMapPickupCenter] = useState<LatLng | null>(null);
  const [mapDestCenter, setMapDestCenter] = useState<LatLng | null>(null);

  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [isLocatingPickup, setIsLocatingPickup] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Load current rides on mount
  useEffect(() => {
    const loadRides = async () => {
      try {
        const res = await fetch("/api/rides/getcurrentrides", { method: "GET" });
        const data = await res.json();
        if (!res.ok) {
          setIsError(true);
          setErrorMessage(data?.error || "Failed to load current rides");
          return;
        }

        const rides: Ride[] = (data?.rides ?? data ?? []).map((r: any) => ({
          id: r.id,
          pickup: r.pickup_address ?? r.pickup,
          destination: r.destination_address ?? r.destination,
          pickupLatLng: r.pickup_lat && r.pickup_lng ? { lat: r.pickup_lat, lng: r.pickup_lng } : undefined,
          destinationLatLng: r.destination_lat && r.destination_lng ? { lat: r.destination_lat, lng: r.destination_lng } : undefined,
          seats: r.seats,
          driverID: r.driver_id ?? undefined,
          startedAt: r.started_at ?? null,
          finishedAt: r.finished_at ?? null,
        }));
        setUserRides(rides);
      } catch (err) {
        setIsError(true);
        setErrorMessage("Unable to load current rides.");
      }
    };
    loadRides();
  }, []);

  // Action handlers for rides
  const leaveRide = async (rideId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [`leave-${rideId}`]: true }));
      const res = await fetch("/api/rides/leaveride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to leave ride");
      // Remove ride from local list (either left or deleted)
      setUserRides(prev => prev.filter(r => r.id !== rideId));
      setIsSuccess(true);
      setSuccessMessage("Left ride successfully.");
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || "Unable to leave ride.");
    } finally {
      setUpdating(prev => ({ ...prev, [`leave-${rideId}`]: false }));
    }
  };

  const becomeDriver = async (rideId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [`driver-${rideId}`]: true }));
      const res = await fetch("/api/rides/setridedriver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to become driver");
      setUserRides(prev => prev.map(r => r.id === rideId ? { ...r, driverID: user?.id } : r));
      setIsSuccess(true);
      setSuccessMessage("You are now the driver.");
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || "Unable to set driver.");
    } finally {
      setUpdating(prev => ({ ...prev, [`driver-${rideId}`]: false }));
    }
  };

  const setStarted = async (rideId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [`start-${rideId}`]: true }));
      const res = await fetch("/api/rides/setstarted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to set started");
      setUserRides(prev => prev.map(r => r.id === rideId ? { ...r, startedAt: new Date() } : r));
      setIsSuccess(true);
      setSuccessMessage("Ride started.");
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || "Unable to start ride.");
    } finally {
      setUpdating(prev => ({ ...prev, [`start-${rideId}`]: false }));
    }
  };

  const setFinished = async (rideId: number) => {
    try {
      setUpdating(prev => ({ ...prev, [`finish-${rideId}`]: true }));
      const res = await fetch("/api/rides/setfinished", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to set finished");
      setUserRides(prev => prev.map(r => r.id === rideId ? { ...r, finishedAt: new Date() } : r));
      // setUserRides(prev => prev.filter(r => r.id !== rideId));
      setIsSuccess(true);
      setSuccessMessage("Ride finished.");
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || "Unable to finish ride.");
    } finally {
      setUpdating(prev => ({ ...prev, [`finish-${rideId}`]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, section: string) => {
    e.preventDefault();

    if (!pickup || !destination) {
      setIsError(true);
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setUpdating(prev => ({ ...prev, [section]: true }));      
      const res = await fetch("/api/rides/newride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: pickup,
          destinationAddress: destination,
          seats: seats ? Number(seats) : null,
          destinationLat: mapCenter?.lat ?? null,
          destinationLng: mapCenter?.lng ?? null,
          beDriver: beDriver,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Create ride error:", data);
        setIsError(true);
        setErrorMessage(data.error || "Failed to create ride");
        return;
      }
      
      const newRide: Ride = {
        id: data?.id ?? -1,
        pickup: data?.pickup_address ?? pickup,
        destination: data?.destination_address ?? destination,
        pickupLatLng: data?.pickup_lat && data?.pickup_lng ? { 
          lat: data.pickup_lat, lng: data.pickup_lng } : undefined,
        destinationLatLng: data?.destination_lat && data?.destination_lng ? {
          lat: data.destination_lat, lng: data.destination_lng } : undefined,
        seats: data?.seats ?? Number(seats),
        driverID: data?.driver_id ?? undefined,
        startedAt: data?.started_at ?? null,
        finishedAt: data?.finished_at ?? null,
      };

      setUserRides((prev) => [...prev, newRide]);

      setPickup("");
      setDestination("");
      setSeats("");
      setBeDriver(false);

      setIsSuccess(true);
      setSuccessMessage("Ride requested successfully!");
    } catch (err) {
      console.error(err);
      setIsError(true);
      setErrorMessage("Something went wrong creating the ride.");
    } finally {
      setUpdating(prev => ({ ...prev, [section]: false }));
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
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
      {isError && (
        <div className="max-w-6xl mx-auto mt-6 bg-red-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl ">
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
        <div className="max-w-6xl mx-auto mt-6 bg-green-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
            <button
              onClick={() => { setIsSuccess(false); setSuccessMessage(""); }}
              className="text-white/80 hover:text-white text-lg leading-none"
              aria-label="Dismiss success"
            >✕</button>
          </div>
        </div>
      )}
 
      {/* Main card */}
      <div className="max-w-6xl mx-auto bg-black/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="font-[Aboreto] text-3xl md:text-4xl mb-8 text-center tracking-wider">
          HerRide Dashboard 
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Request a Ride */}
          <form
            onSubmit={(e) => handleSubmit(e, "requestRide")}
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
                Seats
              </label>
              <div className="flex items-center bg-white/20 rounded-md px-3">
                <CarFront size={18} className="text-pink-300 mr-2" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={seats}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^[0-9]+$/.test(v)) {
                      setSeats(v);
                    }
                  }}
                  placeholder="Number of seats"
                  className="w-full bg-transparent border-none focus:outline-none text-white placeholder-gray-300 py-2"
                  required
                />
              </div>
            </div>

            <label className="text-pink-200 flex items-center gap-2 text-sm mt-2">
              <input
                type="checkbox"
                className="accent-pink-400"
                checked={beDriver}
                onChange={(e) => setBeDriver(e.target.checked)}
              />
              Be the driver for this ride.
            </label>
            <button
              type="submit"
              disabled={updating["requestRide"]}
              className="w-full mt-2 bg-linear-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition"
            >
              {updating['requestRide'] ? 'Creating Ride..' : 'Request a Ride'}
            </button>
          </form>

              {/* Browse Rides with map */}
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

              {/* Map area */}
              <Map center={mapCenter || undefined} />

              <button className="w-full mt-4 bg-linear-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition">
                Browse Rides
              </button>
            </div>

        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Current Rides */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="font-[Aboreto] text-2xl text-pink-300 mb-3">Current Rides</h2>
            {userRides.length === 0 ? (
              <p className="text-sm text-white/80">No current rides.</p>
            ) : (
              <div className="space-y-4">
                {userRides.map((ride) => {
                  const hasStarted = Boolean(ride.startedAt);
                  const hasFinished = Boolean(ride.finishedAt);
                  const isDriver = !!user?.id && ride.driverID === user?.id;
                  const noDriver = !ride.driverID;
                  return (
                    <div key={ride.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/90 text-sm"><span className="text-pink-300">Pickup:</span> {ride.pickup}</p>
                          <p className="text-white/90 text-sm"><span className="text-pink-300">Destination:</span> {ride.destination}</p>
                          <p className="text-white/90 text-sm"><span className="text-pink-300">Seats:</span> {ride.seats}</p>
                        </div>
                        <div className="text-xs text-white/60">
                          {hasStarted ? "Started" : "Not started"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => leaveRide(ride.id)}
                          disabled={hasStarted || updating[`leave-${ride.id}`]}
                          className="w-full bg-white/20 text-white text-sm py-2 rounded-md hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {updating[`leave-${ride.id}`] ? "Leaving..." : "Leave ride"}
                        </button>

                        <button
                          type="button"
                          onClick={() => becomeDriver(ride.id)}
                          disabled={hasStarted || !noDriver || updating[`driver-${ride.id}`]}
                          className="w-full bg-white/20 text-white text-sm py-2 rounded-md hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {updating[`driver-${ride.id}`] ? "Setting..." : "Be Driver"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setStarted(ride.id)}
                          disabled={hasStarted || !isDriver || updating[`start-${ride.id}`]}
                          className="w-full bg-white/20 text-white text-sm py-2 rounded-md hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {updating[`start-${ride.id}`] ? "Starting..." : "Set Started"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setFinished(ride.id)}
                          disabled={!isDriver || !hasStarted || hasFinished || updating[`finish-${ride.id}`]}
                          className="w-full bg-white/20 text-white text-sm py-2 rounded-md hover:bg-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {updating[`finish-${ride.id}`] ? "Finishing..." : "Set Finished"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => router.push('/rides')}
              className="w-full mt-4 bg-linear-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition"
            >
              See all Rides
            </button>
          </div>

          {/* Current Ride Messages */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="font-[Aboreto] text-2xl text-pink-300 mb-3">Current Ride Messages</h2>
            <p className="text-sm text-white/80 mb-4">Chat with riders and drivers in your active rides.</p>
            <button
              type="button"
              onClick={() => router.push('/messages')}
              className="w-full mt-2 bg-linear-to-r from-purple-600 to-pink-400 text-white py-2 rounded-md font-[Aboreto] hover:opacity-90 transition"
            >
              See all Messages
            </button>
          </div>

      </div>
    </div>
  </div>
  );
}