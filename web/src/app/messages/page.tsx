"use client";
import { useState, useEffect } from "react";
import { Search, Car } from "lucide-react";
import Image from "next/image";

type CurrentRide = {
  id: number;
  pickup_address: string | null;
  destination_address: string | null;
  seats: number | null;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { from: "other", text: "Hey, I'm almost at the pickup spot!" },
  ]);
  const [input, setInput] = useState("");
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const [rideLoading, setRideLoading] = useState(true);

  // Fetch current ride on mount
  useEffect(() => {
    const fetchCurrentRide = async () => {
      try {
        const res = await fetch("/api/rides/getcurrentrides", { method: "GET" });
        const data = await res.json();
        
        if (!res.ok) {
          console.error("Failed to load current rides:", data?.error);
          setRideLoading(false);
          return;
        }

        // Get the first ongoing ride (or first ride if no started status is tracked)
        const rides = Array.isArray(data.rides) ? data.rides : (Array.isArray(data) ? data : []);
        if (rides.length > 0) {
          setCurrentRide(rides[0]);
        }
      } catch (err) {
        console.error("Error loading current ride:", err);
      } finally {
        setRideLoading(false);
      }
    };

    fetchCurrentRide();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add your message
    setMessages((prev) => [...prev, { from: "me", text: input }]);
    setInput("");

    // Simulate automated response
    setTimeout(() => {
      const lastMessage = messages[messages.length - 1]?.text.toLowerCase();
      let autoReply = "Perfect! See you soon!";
      if (lastMessage?.includes("perfect")) {
        autoReply = "Great, I'm waiting by the entrance 🚗";
      }
      setMessages((prev) => [...prev, { from: "other", text: autoReply }]);
    }, 1000); // 1 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Mock previous messages data
  const previousMessages = [
    {
      user: "Alex P.",
      summary: "Campus Center → Library",
      date: "Nov 1, 2025",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=transparent",
    },
    {
      user: "Maria S.",
      summary: "Dorms → Downtown",
      date: "Oct 28, 2025",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria&backgroundColor=transparent",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* --- LEFT COLUMN: Conversations --- */}
      <aside className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Messages</h2>
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search conversation..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Current Ride
            </h3>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition">
              <Image
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Christian&backgroundColor=transparent"
                alt="user"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                unoptimized
              />

              <div>
                <p className="font-medium text-gray-800">Jessica R.</p>
                <p className="text-xs text-gray-500">To Midtown • In progress</p>
              </div>
            </div>
          </div>

          {/* Previous Messages Section */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Previous Messages</h3>
            <div className="space-y-2">
              {previousMessages.map((msg, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                  <Image
                    src={msg.avatar}
                    alt={msg.user}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    unoptimized
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{msg.user}</p>
                    <p className="text-xs text-gray-500">{msg.summary}</p>
                    <p className="text-xs text-gray-400">{msg.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* --- MIDDLE COLUMN: Chat --- */}
      <section className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">Jessica R.</h2>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  msg.from === "me"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white text-gray-800"
                } p-3 rounded-2xl shadow-sm max-w-xs`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </section>

      {/* --- RIGHT COLUMN: Ride Details --- */}
      <aside className="w-1/4 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Car className="w-5 h-5 text-purple-500 mr-2" />
          Ride Details
        </h2>
        {rideLoading ? (
          <p className="text-sm text-gray-500">Loading ride details...</p>
        ) : currentRide ? (
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Pickup:</strong> {currentRide.pickup_address || "Unknown"}
            </p>
            <p>
              <strong>Destination:</strong> {currentRide.destination_address || "Unknown"}
            </p>
            <p>
              <strong>Date:</strong> {new Date(currentRide.created_at).toLocaleDateString()}
            </p>
            {currentRide.seats !== null && (
              <p>
                <strong>Seats:</strong> {currentRide.seats}
              </p>
            )}
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-medium">In Progress</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active ride</p>
        )}
      </aside>
    </main>
  );
}
