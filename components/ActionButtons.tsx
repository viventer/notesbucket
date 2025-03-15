"use client";

import { useToast } from "@/hooks/useToast";
import AddImage from "@/icons/AddImage";
import Copy from "@/icons/Copy";
import DownloadPdf from "@/icons/DownloadPdf";
import Printer from "@/icons/Printer";

type action = {
  name: string;
  icon: ({ className }: { className?: string }) => JSX.Element;
  handler: () => void;
};

export default function ActionButtons({
  noteContent,
}: {
  noteContent: string;
}) {
  const { showToast } = useToast();

  const addImage = () => {};
  const print = () => {};
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(noteContent);
      showToast("Zawartość została skopiowana", "success");
    } catch (err) {
      showToast("Błąd kopiowania zawartości", "error");
    }
  };
  const downloadPdf = () => {};

  const actions: action[] = [
    { name: "addImage", icon: AddImage, handler: addImage },
    { name: "print", icon: Printer, handler: print },
    { name: "copy", icon: Copy, handler: copy },
    { name: "downloadPdf", icon: DownloadPdf, handler: downloadPdf },
  ];

  return (
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
  );
}
