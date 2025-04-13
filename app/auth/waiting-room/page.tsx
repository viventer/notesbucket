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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const { role } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (role !== "unverified") {
      router.replace("/notes");
    }
  }, [role]);

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
