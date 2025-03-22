"use client";

import { useFormContext } from "react-hook-form";
import Folder from "./Folder";
import { useEffect, useState } from "react";
import { FolderType } from "@/lib/dbSchemas";
import AddFolder from "@/icons/AddFolder";
import { Input } from "./ui/input";
import { usePathname } from "next/navigation";
import { createFolder, CreateFolderData, getFolderData } from "@/lib/folders";

export default function NoteSelector({ folders }: { folders: FolderType[] }) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  const [newFolderName, setNewFolderName] = useState("nowy folder");
  const [updatedFolders, setUpdatedFolders] = useState<FolderType[]>(folders);

  useEffect(() => {
    let filteredFoldersArray;

    if (selectedCategory === "Szkoła") {
      filteredFoldersArray = folders.filter(
        (folder) => folder.subject === selectedSubject
      );
    } else {
      filteredFoldersArray = folders.filter(
        (folder) => folder.category === selectedCategory
      );
    }
    filteredFoldersArray.sort((a, b) => a.name.localeCompare(b.name));

    setUpdatedFolders(filteredFoldersArray);
  }, [selectedCategory, selectedSubject]);

  const pathname = usePathname();
  const isEditView = pathname.includes("edit");

  const handleFolderCreate = async () => {
    const newFolderCreateData: CreateFolderData = {
      name: newFolderName,
      category: selectedCategory,
      subject: selectedSubject,
    };
    const newFolderId = await createFolder(newFolderCreateData);
    const newFolderData = await getFolderData(newFolderId);
    setUpdatedFolders((prev) => [...prev, newFolderData]);
  };

  return (
    <>
      {isEditView && (
        <button
          className="flex items-center gap-2"
          onClick={handleFolderCreate}
        >
          <AddFolder className="size-4 text-success" />
          <p>Utwórz folder</p>
        </button>
      )}
      {updatedFolders.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
    </>
  );
}
