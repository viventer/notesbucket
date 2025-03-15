"use client";

import { useToast } from "@/hooks/useToast";
import AddImage from "@/icons/AddImage";
import Copy from "@/icons/Copy";
import DownloadDoc from "@/icons/DownloadDoc";

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

  const addImage = () => {};
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

  const actions: action[] = [
    { name: "copy", icon: Copy, handler: copy },
    { name: "downloadMd", icon: DownloadDoc, handler: downloadMd },
  ];

  if (mode == "edit") {
    actions.push({ name: "addImage", icon: AddImage, handler: addImage });
  }

  return (
    <>
      <aside className="w-full flex justify-end gap-4 mb-4">
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
    </>
  );
}
