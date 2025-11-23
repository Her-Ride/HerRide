"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function ProfilePage() {
  // User profiles
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleInitial, setMiddleInitial] = useState<string>("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [sharePhone, setSharePhone] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [shareEmail, setShareEmail] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("/profile.png");
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
  const [seats, setSeats] = useState<number>(0);

  // State
  const [username, setUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get info from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/getuser');
        const json = await res.json();
        if (!res.ok) {
          setIsError(true);
          setErrorMessage(json?.error || 'Failed to fetch user from Supabase');
          return;
        }
        const u = json?.user;
        if (!u) return;

        setFirstName(u.first_name || '');
        setLastName(u.last_name || '');
        setMiddleInitial(u.middle_initial || '');
        setPhone(u.phone_number || undefined);
        setSharePhone(Boolean(u.share_phone));
        setEmail(u.email || '');
        setShareEmail(Boolean(u.share_email));
        setBio(u.bio || '');
        if (u.profile_img_url) setProfilePic(u.profile_img_url);
        setMake(u.vehicle_make || '');
        setModel(u.vehicle_model || '');
        setYear(u.vehicle_year ? Number(u.vehicle_year) : 0);
        setColor(u.vehicle_color || '');
        setPlate(u.license_plate_number || '');
        setSeats(u.seats_available ? Number(u.seats_available) : 0);
      } catch (e: any) {
        setIsError(true);
        setErrorMessage(e?.message || 'Error fetching user');
      }
    };

    fetchUser();
  }, []);

  // Get info from Clerk (profile image, username)
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
  
    setUsername(user.username || '');
    if (profilePic === '/profile.png') setProfilePic(user.imageUrl);
  }, [user]);

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
                  maxLength={1}
                  onChange={(e) => setMiddleInitial(e.target.value.slice(0, 1).toUpperCase())}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <PhoneInput
                  international
                  defaultCountry="US"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    className="accent-pink-400"
                    checked={sharePhone}
                    onChange={(e) => setSharePhone(e.target.checked)}
                  />
                  Share phone with drivers & passengers
                </label>
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    className="accent-pink-400"
                    checked={shareEmail}
                    onChange={(e) => setShareEmail(e.target.checked)}
                  />
                  Share e-mail with drivers & passengers
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setYear(0);
                      } else  {
                        const n = parseInt(e.target.value, 10);
                        if (n > 1000 && n < 9999) {
                          setYear(n);
                        }
                      }
                    }}
                    className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                  />
                </div>
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
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setSeats(0);
                    } else  {
                      const n = parseInt(e.target.value, 10);
                      if (n >= 0) {
                        setSeats(n);
                      }
                    }
                  }}
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
                  placeholder="Username"
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
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
                  value={bio}
                  rows={2}
                  onChange={(e) => {
                    setBio(e.target.value);
                    const el = e.currentTarget as HTMLTextAreaElement;
                    el.style.height = "auto";
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  className="w-full bg-white/20 p-2 rounded-md text-white placeholder-gray-300 border-none focus:ring-2 focus:ring-pink-400 overflow-hidden resize-none"
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
              <h2 className="font-[Aboreto] text-xl text-pink-300 mb-4">Stats (Coming soon!)</h2>
              <div className="flex justify-around text-gray-200 mb-4">
                <div>
                  <p className="text-2xl text-yellow-400 font-bold">
                    4.5
                  </p>
                  <p>Rating</p>
                </div>
                <div>
                  <p className="text-2xl text-pink-400 font-bold">
                    6
                  </p>
                  <p>Rides</p>
                </div>
                <div>
                  <p className="text-2xl text-purple-400 font-bold">
                    2
                  </p>
                  <p>Rides Driven</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isError && (
        <div className="max-w-6xl mx-auto mt-6 bg-red-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl ">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => { setIsError(false); setErrorMessage(''); }}
              className="text-white/80 hover:text-white"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
