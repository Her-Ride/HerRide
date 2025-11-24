"use client";

import React, { useEffect, useState } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
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
   const [year, setYear] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
   const [seats, setSeats] = useState<string>("");

  // State
  const [username, setUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>();
  const [oldPassword, setOldPassword] = useState<string>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  // States for email
  const [code, setCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const [emailObj, setEmailObj] = useState<any | undefined>();

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
        setYear(u.vehicle_year && Number(u.vehicle_year) > 0 ? String(u.vehicle_year) : "");
        setColor(u.vehicle_color || '');
        setPlate(u.license_plate_number || '');
        setSeats(u.seats_available && Number(u.seats_available) > 0 ? String(u.seats_available) : "");
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

  const createEmailAddress = useReverification((email: string) =>
    user?.createEmailAddress({ email }),
  );
  const updateEmailAddress = useReverification((primaryEmailAddressId: string) =>
    user?.update({ primaryEmailAddressId }),
  );
  const handleUpdate = async (section: string) => {
    try {
      let payload: Record<string, any> = {};
      switch (section) {
        case 'Personal':
          if (middleInitial && middleInitial.length > 1) {
            setIsError(true); setErrorMessage('Middle initial must be one character'); return;
          }
          if (user) {
            const currentEmail = user.primaryEmailAddress?.emailAddress;
            if (email && currentEmail && email !== currentEmail) {
              try {
                // If the typed email already exists on the account, reuse it instead of creating
                const existing = user.emailAddresses.find(a => a.emailAddress?.toLowerCase() === email.toLowerCase());
                if (existing) {
                  if (existing.verification?.status === 'verified') {
                    await updateEmailAddress( existing.id );
                    await user.reload();
                    setEmail(existing.emailAddress);
                  } else {
                    // Re-send a code and show verify UI
                    setEmailObj(existing);
                    await existing.prepareVerification({ strategy: 'email_code' });
                    setIsVerifying(true);
                  }
                } else {
                  const newEmail = await createEmailAddress(email);
                  await user.reload();
                  const emailAddress = user.emailAddresses.find((a) => a.id === newEmail?.id);
                  if (emailAddress) {
                    setEmailObj(emailAddress);
                    setEmail(currentEmail);
                    emailAddress.prepareVerification({ strategy: 'email_code' });
                    setIsVerifying(true);
                  }
                }
              } catch (err: any) {
                setIsError(true);
                setErrorMessage(err?.message || 'Failed initiating Clerk email change');
                return; 
              }
            }
          }
          payload = {
            first_name: firstName,
            last_name: lastName,
            middle_initial: middleInitial,
            email,
            phone_number: phone,
            share_phone: sharePhone,
            share_email: shareEmail,
          };
          console.log(payload)
          break;
        case 'Vehicle':
          if (year !== '' && !(Number(year) > 1000 && Number(year) < 9999)) { setIsError(true); setErrorMessage('Invalid year'); return; }
          if (seats !== '' && Number(seats) < 0) { setIsError(true); setErrorMessage('Seats cannot be negative'); return; }
          payload = {
            vehicle_make: make,
            vehicle_model: model,
            vehicle_year: year === '' ? null : Number(year),
            vehicle_color: color,
            license_plate_number: plate,
            seats_available: seats === '' ? 0 : Number(seats),
          };
          break;
        case 'About':
          payload = { 
            bio,
          };
          break;
        case 'Security':
          alert('Soon');
          return;
        default:
          return;
      }

      setUpdating(prev => ({ ...prev, [section]: true }));

      const res = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setIsError(true);
        setErrorMessage(json?.error || 'Failed to update');
      } else {
        setSuccessful(true);
      }
    } catch (e: any) {
      setIsError(true);
      setErrorMessage(e?.message || 'Update error');
    } finally {
      setUpdating(prev => ({ ...prev, [section]: false }));
    }
  };


  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) { setIsError(true); setErrorMessage('Must be signed in'); return; }
    try {
      await user.setProfileImage({ file });
      await user.reload();
      const newUrl = user.imageUrl;
      if (newUrl) setProfilePic(newUrl);
      // Mirror URL into Supabase profile table
      await fetch('/api/users/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_img_url: newUrl }),
      });
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err?.message || 'Failed to update profile image');
    }
  };

  // Verification helpers
  const verifyEmailCode = async () => {
    if (!user || !emailObj) return;
    try {
      const attempt = await emailObj.attemptVerification({ code });
      if (attempt?.verification.status === 'verified') {
        // Make primary & persist
        await user.update({ primaryEmailAddressId: emailObj.id });
        await user.reload();
        setEmail(emailObj.emailAddress);
        await fetch('/api/users/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailObj.emailAddress }),
        });
        setSuccessful(true);
        setIsVerifying(false);
        setCode('');
      } else {
        setIsError(true); setErrorMessage('Invalid or expired code.');
      }
    } catch (err: any) {
      setIsError(true); setErrorMessage(err?.message || 'Verification error');
    }
  };

  const resendVerificationCode = async () => {
    try {
      await emailObj?.prepareVerification({ strategy: 'email_code' });
    } catch (err: any) {
      setIsError(true); setErrorMessage(err?.message || 'Failed to resend code');
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
              onClick={() => { setIsError(false); setErrorMessage(''); }}
              className="text-white/80 hover:text-white"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Success message */}
      {successful && (
        <div className="max-w-6xl mx-auto mt-6 bg-green-900/60 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">Info updated!</p>
              <p className="text-sm">Your information has been updated.</p>
            </div>
            <button
              onClick={() => { setSuccessful(false); setEmailObj(undefined); }}
              className="text-white/80 hover:text-white text-lg leading-none"
              aria-label="Dismiss success"
            >✕</button>
          </div>
        </div>
      )}
      {/* Verification prompt */}
      {isVerifying && !successful && emailObj && (
        <div className="max-w-6xl mx-auto mt-6 bg-pink-900/50 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-start gap-4">
            <div className="w-full space-y-4">
              <p className="font-semibold">Verify new email</p>
              <p className="text-xs text-white/70">Enter the code sent to <span className="text-pink-200">{emailObj.emailAddress}</span>.</p>
              <div className="space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={verifyEmailCode}
                    disabled={code.length === 0}
                    className="flex-1 min-w-[110px] bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md font-[Aboreto] disabled:opacity-50"
                  >Verify</button>
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    className="px-3 py-2 bg-white/20 rounded-md text-sm hover:bg-white/30"
                  >Resend</button>
                  <button
                    type="button"
                    onClick={() => { setIsVerifying(false); setCode(''); setEmailObj(undefined); }}
                    className="px-3 py-2 bg-white/10 rounded-md text-sm hover:bg-white/20"
                  >Cancel</button>
                </div>
                <p className="text-[10px] text-white/50">Primary email updates only after successful verification.</p>
              </div>
            </div>
            <button
              onClick={() => { setIsVerifying(false); setCode(''); setEmailObj(undefined); }}
              className="text-white/80 hover:text-white text-lg leading-none"
              aria-label="Close verification"
            >✕</button>
          </div>
        </div>
      )}
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
                  disabled={!!updating['Personal']}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md mt-2 font-[Aboreto] hover:opacity-90 transition disabled:opacity-60"
                >
                  {updating['Personal'] ? 'Updating…' : 'Update'}
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') {
                        setYear('');
                      } else if (/^[0-9]{0,4}$/.test(v)) {
                        setYear(v);
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
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Available Seats"
                  value={seats}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '') {
                      setSeats('');
                    } else if (/^[0-9]*$/.test(v)) {
                      setSeats(v);
                    }
                  }}
                  className="w-full bg-white/20 p-2 rounded-md placeholder-gray-300 focus:ring-2 focus:ring-pink-400 border-none"
                />
                <button
                  onClick={() => handleUpdate("Vehicle")}
                  disabled={!!updating['Vehicle']}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md mt-2 font-[Aboreto] hover:opacity-90 transition disabled:opacity-60"
                >
                  {updating['Vehicle'] ? 'Updating…' : 'Update'}
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
                  disabled={!!updating['About']}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-400 py-2 rounded-md font-[Aboreto] hover:opacity-90 transition disabled:opacity-60"
                >
                  {updating['About'] ? 'Updating…' : 'Update'}
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


    </div>
  );
}
