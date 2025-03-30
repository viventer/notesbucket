"use client";

import { useToast } from "@/hooks/useToast";
import AddFolder from "@/icons/AddFolder";
import { createFolder, CreateFolderData } from "@/lib/folders";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

export default function CreateFolderButton({
  isSubFolder,
  parentFolderId,
  setNewFolderIds,
}: {
  isSubFolder: boolean;
  parentFolderId?: string;
  setNewFolderIds: Dispatch<SetStateAction<string[]>>;
}) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");
  const { showToast } = useToast();

  const handleFolderCreate = async () => {
    if (isSubFolder && !parentFolderId) {
      throw new Error("W przypadku podfolderów parentFolderId jest wymagany.");
    }

    const newFolderCreateData: CreateFolderData = {
      name: "nowy folder",
      category: selectedCategory,
      subject: selectedSubject,
      parentFolderId: parentFolderId || undefined,
    };
    try {
      const newFolderId = await createFolder(newFolderCreateData);
      setNewFolderIds((prev) => [...prev, newFolderId]);
      showToast("Nowy folder został utworzony", "success");
    } catch (err) {
      showToast(`Błąd tworzenia folderu: ${err}`, "error");
    }
  };

  const buttonText = `Utwórz ${isSubFolder ? "pod" : ""}folder`;

  return (
    <button
      className={`flex items-center gap-2 ${isSubFolder ? "ml-4" : ""}`}
      onClick={handleFolderCreate}
    >
      <AddFolder className="size-4 text-success" />
      <p>{buttonText}</p>
    </button>
  );
}
