"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import GoogleLogo from "@/icons/GoogleLogo";
import { createUser, signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const { showToast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { isNewUser, user } = await signInWithGoogle();
      showToast("Pomyślnie zalogowano.", "success");

      if (isNewUser) {
        await createUser(user);
        router.push("/auth/complete-profile");
      }
    } catch (error) {
      showToast("Błąd logowania.", "error");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zaloguj się</CardTitle>
        <CardDescription>
          Logowanie jest wymagane aby uzyskać dostęp do notatek.
        </CardDescription>
      </CardHeader>
      <CardContent className="my-2">
        <button
          onClick={handleGoogleSignIn}
          className="text-l border-[0.1rem] border-solid border-primary flex items-center gap-2 px-3 py-2 rounded-md hover:border-accent"
        >
          <GoogleLogo className="size-4" />
          Kontynuuj przez Google
        </button>
      </CardContent>
    </Card>
  );
}
