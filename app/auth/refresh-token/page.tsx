"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged } from "firebase/auth";
import Loader from "@/components/Loader";
import { setAuthToken } from "@/lib/auth";

export default function RefreshTokenPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        await setAuthToken(token);
      } else {
        await setAuthToken("");
        router.replace("/auth");
      }
    });
    return unsub;
  }, [from, router]);

  return <Loader />;
}
