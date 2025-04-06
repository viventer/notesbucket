"use client";

import { checkIfNewUser, getUserPerms } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Redirection() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (pathname === "/auth") {
      router.replace("/");
      return;
    }

    (async function () {
      const isNewUser = await checkIfNewUser(user.uid);
      if (isNewUser && pathname !== "/auth/complete-profile") {
        router.replace("/auth/complete-profile");
        return;
      }

      if (!isNewUser && pathname === "/auth/complete-profile") {
        router.replace("/");
        return;
      }

      const { role } = await getUserPerms(user.uid);

      if (pathname === "/auth/waiting-room" && role !== "unverified") {
        router.replace("/");
        return;
      }

      if (
        pathname !== "/auth/waiting-room" &&
        pathname !== "/" &&
        role === "unverified"
      ) {
        // router.replace("/auth/waiting-room");
        return;
      }

      if (
        (pathname.startsWith("/notes/edit") || pathname == "/users") &&
        role !== "admin"
      ) {
        router.replace("/");
        return;
      }
    })();
  }, [loading]);

  return null;
}
