"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthToken } from "@/lib/authToken";

export default function AuthTokenUpdater() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
