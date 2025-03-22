"use client";

import { useFormContext } from "react-hook-form";
import Folder from "./Folder";
import { useEffect, useState } from "react";
import { FolderType } from "@/lib/dbSchemas";
import { usePathname } from "next/navigation";
import CreateFolderButton from "./CreateFolderButton";

export default function NoteSelector({ folders }: { folders: FolderType[] }) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  const [updatedFolders, setUpdatedFolders] = useState<FolderType[]>(folders);
  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);

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

  return (
    <>
      {isEditView && (
        <CreateFolderButton
          setUpdatedFolders={setUpdatedFolders}
          isSubFolder={false}
          setNewFolderIds={setNewFolderIds}
        />
      )}
      {updatedFolders.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          isNew={newFolderIds.includes(folder.id)}
        />
      ))}
    </>
  );
}
