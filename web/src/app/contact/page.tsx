"use client";

import { Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-6">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-10 grid md:grid-cols-2 gap-10">
        {/* LEFT COLUMN */}
        <div>
          <h2 className="text-3xl font-bold text-black mb-4">Contact Us</h2>
          <p className="text-gray-500 mb-8">
            Any questions or remarks? Just write us a message!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-black-500" size={20} />
              <span className="text-gray-700 text-sm">+1 (555) 123-4567</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-black-500" size={20} />
              <span className="text-gray-700 text-sm">
                contact@herride.com
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
          <form className="space-y-4">
            {/* NAME FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* EMAIL + NUMBER */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* SUBJECT CHOICES */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-700">
                Subject
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="subject" className="accent-pink-500" />
                  <span className="text-sm text-gray-700">General Inquiry</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="subject" className="accent-pink-500" />
                  <span className="text-sm text-gray-700">Help & Support</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="subject" className="accent-pink-500" />
                  <span className="text-sm text-gray-700">Report User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="subject" className="accent-pink-500" />
                  <span className="text-sm text-gray-700">Other</span>
                </label>
              </div>
            </div>

            {/* MESSAGE FIELD */}
            <div>
              <textarea
                placeholder="Write your message here..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            {/* SEND BUTTON */}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-white font-semibold 
                        bg-gradient-to-r from-purple-500 to-pink-500 
                        hover:from-purple-600 hover:to-pink-600 
                        transition-all duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

