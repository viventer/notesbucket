"use client";

import { useFormContext } from "react-hook-form";
import Folder from "./Folder";
import { useEffect, useState } from "react";
import { SerializedFolderType } from "@/lib/dbSchemas";
import CreateFolderButton from "./CreateFolderButton";
import { useIsEditView } from "@/hooks/useIsEditView";

export default function NoteSelector({
  folders,
}: {
  folders: SerializedFolderType[];
}) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<
    SerializedFolderType[]
  >([]);

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

    setFilteredFolders(filteredFoldersArray);
  }, [selectedCategory, selectedSubject, folders]);

  const isEditView = useIsEditView();

  return (
    <div className="flex gap-2 flex-col">
      {isEditView && (
        <CreateFolderButton
          isSubFolder={false}
          setNewFolderIds={setNewFolderIds}
        />
      )}
      {filteredFolders?.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          isNew={newFolderIds.includes(folder.id)}
        />
      ))}
    </div>
  );
}
