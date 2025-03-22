"use client";

import AddFolder from "@/icons/AddFolder";
import { FolderType } from "@/lib/dbSchemas";
import { createFolder, CreateFolderData, getFolderData } from "@/lib/folders";
import { SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

export default function CreateFolderButton({
  setUpdatedFolders,
  isSubFolder,
  parentFolderId,
}: {
  setUpdatedFolders: (value: SetStateAction<FolderType[]>) => void;
  isSubFolder: boolean;
  parentFolderId?: string;
}) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

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
    const newFolderId = await createFolder(newFolderCreateData);
    const newFolderData = await getFolderData(newFolderId);
    setUpdatedFolders((prev) => [...prev, newFolderData]);
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
