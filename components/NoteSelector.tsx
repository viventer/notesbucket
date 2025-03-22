"use client";

import { useFormContext } from "react-hook-form";
import Folder from "./Folder";
import { useEffect, useState } from "react";
import { FolderType } from "@/lib/dbSchemas";
import AddFolder from "@/icons/AddFolder";
import { Input } from "./ui/input";

export default function NoteSelector({ folders }: { folders: FolderType[] }) {
  const form = useFormContext();
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  const [filteredFolders, setFilteredFolders] = useState(folders);
  const [newFolderName, setNewFolderName] = useState("nowy folder");

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
  }, [selectedCategory, selectedSubject]);

  const foldersElements = filteredFolders.map((folder) => (
    <Folder key={folder.id} folder={folder} />
  ));

  const handleFolderCreate = () => {};

  return (
    <>
      <button className="flex items-center gap-2" onClick={handleFolderCreate}>
        <AddFolder className="size-4 text-success" />
        <p>Utwórz folder</p>
      </button>
      {foldersElements}
    </>
  );
}
