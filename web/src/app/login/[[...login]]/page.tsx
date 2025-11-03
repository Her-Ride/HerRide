"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full font-sans">
      {/* LEFT SIDE - FORM */}
      <div className="flex-1 flex justify-center items-center bg-white p-8 md:p-16">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "w-full text-white font-bold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform transition-all duration-300",
            },
            layout: {
              socialButtonsPlacement: "bottom"
            }
          }}
        />
      </div>

      {/* RIGHT SIDE - BACKGROUND IMAGE */}
      <div
        className="flex-1 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: 'url(/background.png)' }}
      >
      </div>
    </div>
  );
}
