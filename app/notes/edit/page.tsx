"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useUser } from "@/components/UserContext";
import NoteIcon from "@/icons/NoteIcon";
import { useRouter } from "next/navigation";

export default function page() {
  const { role } = useUser();
  const isAdmin = role === "admin";
  const router = useRouter();
  if (!isAdmin) {
    router.replace("/unauthorized");
  }

  return (
    <Card className="mt-[8rem] p-4 bg-background max-w-[500px] mx-auto">
      <CardTitle className="flex items-center gap-2">
        <NoteIcon className="size-[2rem] sm:size-[3rem]" />
        <h2 className="text-[1.5rem] font-[500] sm:text-[2rem]">
          Wybierz notatkę
        </h2>
      </CardTitle>
      <CardDescription>Rozwiń menu aby ją znaleźć</CardDescription>
    </Card>
  );
}
