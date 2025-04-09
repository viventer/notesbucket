"use client";

import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/auth";

export default function LogoutButton({ className }: { className?: string }) {
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      signOut(auth);
      await removeAuthToken();
      router.push("/");
      showToast("Zostałeś wylogowany", "success");
    } catch (err) {
      showToast("Błąd wylogowywania", "error");
      console.error(err);
    }
  };

  return (
    <Button
      variant={"outline"}
      className={`${className} border-destructive hover:border-primary`}
      onClick={handleLogout}
    >
      Wyloguj się
    </Button>
  );
}
