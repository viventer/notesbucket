import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import NoteIcon from "@/icons/NoteIcon";
import React from "react";

export default function Page() {
  return (
    <Card className="mt-[8rem] p-4 bg-background max-w-[500px] mx-auto">
      <CardTitle className="flex items-center gap-2">
        <NoteIcon className="size-[2rem] sm:size-[3rem] text-text" />
        <h2 className="text-[1.5rem] font-[500] sm:text-[2rem] text-text">
          Wybierz notatkę
        </h2>
      </CardTitle>
      <CardDescription>Rozwiń menu aby ją znaleźć</CardDescription>
    </Card>
  );
}
