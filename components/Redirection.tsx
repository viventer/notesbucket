"use client";

import { getUserPerms } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Redirection() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    (async function () {
      const { role } = await getUserPerms(user.uid);
      if (role === "unverified") {
        router.replace("/auth/waiting-room");
        return;
      } else {
        router.replace("/");
      }
    })();
  }, [loading]);

  return null;
}
