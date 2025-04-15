"use client";

import LogoutButton from "@/components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/components/UserContext";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page() {
  const { role } = useUser();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (role !== "unverified") {
      router.replace("/notes");
    } else if (!user) {
      router.replace("/auth");
    }
  }, [role, loading, router, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twoje konto jest weryfikowane</CardTitle>
        <CardDescription>
          Aby przyśpieszyć i ułatwić weryfikację - napisz do mnie na
          messengerze.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full  flex justify-end">
        <LogoutButton />
      </CardContent>
    </Card>
  );
}
