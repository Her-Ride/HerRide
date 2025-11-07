"use client";

import React, { useState } from "react";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  // --- STATE MANAGEMENT ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [phone, setPhone] = useState("");
  const [make, setMake] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [seats, setSeats] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [about, setAbout] = useState("");

  // --- NEW: Profile picture ---
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // --- Stats placeholders (to be filled dynamically later) ---
  const [rating] = useState<string | null>(null);
  const [rides] = useState<number | null>(null);
  const [tier] = useState<string | null>(null); // bronze / gold / platinum (future logic)

  const handleUpdate = (section: string) => {
    alert(` ${section} information updated!`);
  };

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-12"
      style={{ backgroundImage: "url(/background.png)" }}
    >
      <div className="max-w-6xl mx-auto bg-black/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="font-[Aboreto] text-3xl md:text-4xl mb-8 text-center tracking-wider">
          Hello, {firstName || "Driver"}!
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ---------- LEFT SIDE ---------- */}
          <div className="space-y-8">
            {/* Your Info */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">
                Your Info
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="text"
                  placeholder="Middle Initial"
                  value={middleInitial}
                  onChange={(e) => setMiddleInitial(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="tel"
                  placeholder="+1 (___) ___-____"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" className="accent-pink-400" />
                  Share phone with drivers & passengers
                </label>
                <button
                  onClick={() => handleUpdate("Personal")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md mt-2 font-[Aboreto] hover:opacity-90 transition"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Your Vehicle */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">
                Your Vehicle
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Make & Model"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="text"
                  placeholder="License Plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="number"
                  placeholder="Available Seats"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <button
                  onClick={() => handleUpdate("Vehicle")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md mt-2 font-[Aboreto] hover:opacity-90 transition"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">
                Security
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="New Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="password"
                  placeholder="Old Password *"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <button
                  onClick={() => handleUpdate("Security")}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md mt-2 font-[Aboreto] hover:opacity-90 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT SIDE ---------- */}
          <div className="space-y-8">
            {/* About You */}
<div className="bg-white/10 rounded-xl p-6 text-center">
  <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">
    About You
  </h2>
  <div className="flex flex-col items-center space-y-4">
    {/* Profile picture circle */}
    <div className="w-24 h-24 bg-white/20 rounded-full overflow-hidden flex items-center justify-center">
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-4xl">👩</span>
      )}
    </div>

    {/* Custom upload button */}
    <label
      htmlFor="profile-upload"
      className="cursor-pointer text-pink-300 hover:text-pink-400 font-[Aboreto] transition"
    >
      Upload your profile pic 📁
    </label>
    <input
      id="profile-upload"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />

    <textarea
      placeholder="Tell us about yourself!"
      value={about}
      onChange={(e) => setAbout(e.target.value)}
      className="w-full bg-white/20 p-2 rounded-md text-white placeholder-gray-300 border-none focus:ring-2 focus:ring-pink-400"
    />
    <button
      onClick={() => handleUpdate("About")}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md font-[Aboreto] hover:opacity-90 transition"
    >
      Update
    </button>
  </div>
</div>


            {/* Stats (empty placeholders for now) */}
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">Stats</h2>
              <div className="flex justify-around text-gray-200 mb-4">
                <div>
                  <p className="text-2xl text-yellow-400 font-bold">
                    {rating || "--"}
                  </p>
                  <p>Rating</p>
                </div>
                <div>
                  <p className="text-2xl text-pink-400 font-bold">
                    {rides || "--"}
                  </p>
                  <p>Rides</p>
                </div>
                <div>
                  <p className="text-2xl text-purple-400 font-bold">
                    {tier || "--"}
                  </p>
                  <p>Driver Tier</p>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md font-[Aboreto] hover:opacity-90 transition">
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserProfile />
    </div>
  );
}
