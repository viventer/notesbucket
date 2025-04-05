"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthToken } from "@/lib/auth";

export default function AuthTokenUpdater() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await setAuthToken(token);
      } else {
        await setAuthToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
