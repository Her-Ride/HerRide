"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full font-sans">
      {/* LEFT SIDE - FORM */}
      <div className="flex-1 flex justify-center items-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Log into your account</h1>
          <p className="text-gray-600 mb-6">Welcome back! Select method to log in</p>

          {/* Social login */}
          <div className="flex flex-col gap-3 mb-6">
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Continue with Gmail
            </button>
            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center text-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or continue with email</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Email/password form */}
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="text-pink-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Gradient login button */}
            <button
              type="submit"
              className="w-full p-3 text-white font-bold rounded-md 
                         bg-gradient-to-r from-purple-500 to-pink-500 
                         hover:from-purple-600 hover:to-pink-600 
                         transition-all duration-300"
            >
              Log In
            </button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-pink-600 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - BACKGROUND IMAGE */}
      <div
        className="flex-1 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: 'url(/background.png)' }}
      ></div>
    </div>
  );
}
