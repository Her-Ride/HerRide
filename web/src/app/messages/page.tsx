import { Search, Car, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function MessagesPage() {
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
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=driver"
                alt="user"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">Jessica R.</p>
                <p className="text-xs text-gray-500">To Midtown • In progress</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mt-4 mb-2">
              Previous Rides
            </h3>
            {["Priya K.", "Aisha M.", "Sara T."].map((name, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition"
              >
                <Image
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`}
                  alt={name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">Completed ride</p>
                </div>
              </div>
            ))}
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
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm max-w-xs">
              <p>Hey, I’m almost at the pickup spot!</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl shadow-sm max-w-xs">
              <p>Perfect! I’m waiting by the entrance 🚗</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm max-w-xs">
              <p>See you soon!</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
          />
          <button className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition">
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
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Pickup:</strong> Campus Center
          </p>
          <p>
            <strong>Destination:</strong> Midtown
          </p>
          <p>
            <strong>Date:</strong> Nov 3, 2025
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-medium">In Progress</span>
          </p>
        </div>
      </aside>
    </main>
  );
}
