import { Clock, Car, CheckCircle } from "lucide-react";

export default function RidesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Rides
      </h1>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* 1️⃣ Upcoming */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Upcoming</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gray-100 rounded-lg p-4 hover:bg-purple-50 transition">
              <p><strong>Destination:</strong> Downtown</p>
              <p><strong>Date:</strong> Nov 10, 2025</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 hover:bg-purple-50 transition">
              <p><strong>Destination:</strong> Airport</p>
              <p><strong>Date:</strong> Nov 15, 2025</p>
              <p><strong>Status:</strong> Pending</p>
            </div>
          </div>
        </section>

        {/* 2️⃣ Ongoing */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-6 h-6 text-pink-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Ongoing</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-pink-200 hover:from-purple-100 hover:to-pink-100 transition">
              <p><strong>Driver:</strong> Jessica R.</p>
              <p><strong>From:</strong> Campus Center</p>
              <p><strong>To:</strong> Midtown</p>
              <p><strong>Status:</strong> In Progress 🚗</p>
            </div>
          </div>
        </section>

        {/* 3️⃣ Completed */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="bg-gray-100 rounded-lg p-4 hover:bg-green-50 transition">
              <p><strong>Destination:</strong> Mall</p>
              <p><strong>Date:</strong> Oct 28, 2025</p>
              <p><strong>Driver:</strong> Aisha M.</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 hover:bg-green-50 transition">
              <p><strong>Destination:</strong> Library</p>
              <p><strong>Date:</strong> Oct 20, 2025</p>
              <p><strong>Driver:</strong> Priya K.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
