"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/useToast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { updateUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function NameForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { showToast } = useToast();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleCompleteProfile = () => {
    if (!user) {
      showToast("Nie jesteś zalogowany", "error");
      return;
    }

    if (!firstName || !lastName) {
      showToast("Wypełnij wszystkie pola", "error");
      return;
    }

    try {
      updateUser(user.uid, { firstName, lastName });
      showToast("Profil został uzupełniony", "success");
      router.replace("/auth/waiting-room");
    } catch (err) {
      showToast("Błąd uzupełniania profilu", "error");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-8">
      <div>
        <Label htmlFor="firstName">Imię</Label>
        <Input
          type="text"
          value={firstName}
          id="firstName"
          onChange={(e) => setFirstName(e.target.value)}
          className="h-fit"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Nazwisko</Label>
        <Input
          type="text"
          value={lastName}
          id="lastName"
          onChange={(e) => setLastName(e.target.value)}
          className="h-fit"
        />
      </div>
      <div className="w-full flex justify-end">
        <Button
          variant="default"
          onClick={handleCompleteProfile}
          disabled={loading}
        >
          Dalej
        </Button>
      </div>
    </div>
  );
}
