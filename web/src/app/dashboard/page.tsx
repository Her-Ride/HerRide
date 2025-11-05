export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        HerRide Dashboard
      </h1>

      {/* Grid layout for the four sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* 1️⃣ Request a Ride */}
        <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Request a Ride
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Pickup Location"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              placeholder="Destination"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="datetime-local"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="number"
              placeholder="Available Seats"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
            />
            <button className="w-full py-2 mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
              Request Ride
            </button>
          </div>
        </section>

        {/* 2️⃣ Browse Rides */}
        <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Browse Rides
          </h2>
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
            {/* Placeholder image or map preview */}
            <img
              src="https://via.placeholder.com/400x200?text=Map+Preview"
              alt="Map Preview"
              className="rounded-lg"
            />
          </div>
          <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition">
            Search Rides
          </button>
        </section>

        {/* 3️⃣ Messages */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Messages
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 h-48 overflow-y-auto text-gray-600">
            <p>No new messages yet.</p>
          </div>
        </section>

        {/* 4️⃣ Current Ride Details */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ride Details
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Driver:</strong> N/A</p>
            <p><strong>Pickup:</strong> —</p>
            <p><strong>Destination:</strong> —</p>
            <p><strong>Status:</strong> No active ride</p>
          </div>
        </section>
      </div>
    </main>
  );
}
