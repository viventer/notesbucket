"use client";

import { useFormContext } from "react-hook-form";
import Folder from "./Folder";
import { useEffect, useState } from "react";
import { FolderType } from "@/lib/dbSchemas";

export default function NoteSelector({ folders }: { folders: FolderType[] }) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  const [filteredFolders, setFilteredFolders] = useState(folders);

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
    setFilteredFolders(filteredFoldersArray);
  }, [selectedCategory, selectedSubject]);

  const foldersElements = filteredFolders.map((folder) => (
    <Folder key={folder.id} folder={folder} />
  ));

  return foldersElements;
}
