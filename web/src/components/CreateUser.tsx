"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Ensures a corresponding row exists in Supabase `users` table for the signed-in Clerk user.
 */
export default function CreateUser() {
  const { isSignedIn, user, isLoaded } = useUser();
  const ranRef = useRef(false);
  const version = "1";

  useEffect(() => {
    if (!isSignedIn || !user || !isLoaded) return;

    // prevent double firing in React StrictMode and across re-renders
    if (ranRef.current) return;
    ranRef.current = true;

    const key = `dbUserSynced:${user.id}:${version}`;
    const alreadySynced = typeof window !== "undefined" && localStorage.getItem(key) === "true";
    if (alreadySynced) return;
    
    (async () => {
      try {
        const res = await fetch("/api/users/newuser", { method: "POST" });
        if (res.ok) {
          localStorage.setItem(key, "true");
        } else {
          const message = await res.json();
          if (message?.error && message?.error === 'duplicate key value violates unique constraint "users_pkey"') {
            localStorage.setItem(key, "true");
            console.log("DB user already exists");
          } else {
            console.warn("Failed to sync DB user:", message.error);
          }
        }
      } catch (e) {
        console.warn("Error calling newuser endpoint:", e);
      }
    })();
  }, [isLoaded, isSignedIn, user]);

  // Future idea: Add modal for new users 
  return null;
}
