"use client";

import { getUserPerms } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Redirection() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    (async function () {
      const { role } = await getUserPerms(user.uid);
      if (
        role === "unverified" &&
        pathname !== "/auth/waiting-room" &&
        pathname !== "/"
      ) {
        router.replace("/auth/waiting-room");
        return;
      } else if (
        role !== "admin" &&
        (pathname === "/users" || pathname.startsWith("/notes/edit"))
      ) {
        router.replace("/");
      }
    })();
  }, [loading, pathname]);

  return null;
}
