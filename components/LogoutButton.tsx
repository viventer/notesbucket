"use client";

import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    try {
      signOut(auth);
      router.push("/");
      showToast("Zostałeś wylogowany", "success");
    } catch (err) {
      showToast("Błąd wylogowywania", "error");
      console.error(err);
    }
  };

  return (
    <Button
      variant={"destructive"}
      className={className}
      onClick={handleLogout}
    >
      Wyloguj się
    </Button>
  );
}
