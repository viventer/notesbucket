"use client";

import { useToast } from "@/hooks/useToast";
import AddImage from "@/icons/AddImage";
import Copy from "@/icons/Copy";
import DownloadDoc from "@/icons/DownloadDoc";
import Save from "@/icons/Save";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ImageUpload } from "./ImageUpload";

type action = {
  name: string;
  icon: ({ className }: { className?: string }) => JSX.Element;
  handler: () => void;
};

export default function ActionButtons({
  noteContent,
  mode,
}: {
  noteContent: string;
  mode: "view" | "edit";
}) {
  const { showToast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const addImage = () => {
    setIsSheetOpen(true);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(noteContent);
      showToast("Zawartość została skopiowana", "success");
    } catch (err) {
      showToast("Błąd kopiowania zawartości", "error");
    }
  };

  const downloadMd = () => {
    try {
      const blob = new Blob([noteContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "notatka.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Notatka została pobrana", "success");
    } catch (err) {
      showToast("Błąd pobierania notatki", "error");
    }
  };

  const saveNoteContent = () => {
    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
  };

  const actions: action[] = [
    { name: "copy", icon: Copy, handler: copy },
    { name: "downloadMd", icon: DownloadDoc, handler: downloadMd },
    { name: "save", icon: Save, handler: saveNoteContent },
  ];

  if (mode == "edit") {
    actions.push({ name: "addImage", icon: AddImage, handler: addImage });
  }

  return (
    <>
      <aside className="w-full flex justify-end gap-4">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={action.handler}
            className="text-text transition-all ease-in-out hover:text-accent"
          >
            <action.icon className="size-6 md:size-8" />
          </button>
        ))}
      </aside>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="hidden" />
        </SheetTrigger>
        <SheetContent>
          <DialogTitle className="text-xl font-semibold mb-4">
            Dodaj obrazy
          </DialogTitle>
          <ImageUpload />
        </SheetContent>
      </Sheet>
    </>
  );
}
