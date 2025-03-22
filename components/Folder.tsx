"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FolderType } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import NoteIcon from "@/icons/NoteIcon";
import { truncateString } from "@/lib/utils";
import Link from "next/link";
import { getNotesFromFolderMetadata, NoteMetadata } from "@/lib/notes";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import Save from "@/icons/Save";
import CancelIcon from "@/icons/CancelIcon";

interface FolderProps {
  folder: FolderType;
}

export default function Folder({ folder }: FolderProps) {
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const truncatedFolderName = truncateString(folder.name, 24);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const folderRef = doc(db, "folders", folder.id);

      const rawNotesData = await getNotesFromFolderMetadata(folderRef);

      const notesData = rawNotesData.toSorted((a, b) =>
        a.title.localeCompare(b.title)
      );

      setNotes(notesData);
      setLoading(false);
    }
    fetchNotes();
  }, []);

  const isEditView = pathname.includes("edit");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };
  const saveNameChange = () => {};

  return (
    <div className={`${folder.parentFolderRef ? "ml-4" : ""}`}>
      <button
        className="flex items-center gap-2 text-base"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? (
          <OpenedFolder className="size-4 text-secondary" />
        ) : (
          <ClosedFolder className="size-4 text-secondary" />
        )}
        {showNameInput ? (
          <div className="flex items-center gap-2">
            <Input
              value={newFolderName}
              className="p-0 h-fit"
              onChange={handleNameChange}
            />
            <button onClick={saveNameChange}>
              <Save className="size-4 transition-all ease-in-out hover:text-success" />
            </button>
            <button onClick={() => setShowNameInput(false)}>
              <CancelIcon className="size-4 transition-all ease-in-out hover:text-destructive" />
            </button>
          </div>
        ) : (
          <p onDoubleClick={() => isEditView && setShowNameInput(true)}>
            {truncatedFolderName}
          </p>
        )}
      </button>
      {isExpanded && (
        <>
          <div>
            {folder.children?.map((subFolder: FolderType) => (
              <Folder key={subFolder.id} folder={subFolder} />
            ))}
          </div>

          <div className="ml-4 flex flex-col gap-1 mt-1">
            {loading && <span>Ładowanie notatek...</span>}
            {notes.map((note) => (
              <button key={note.id} onClick={() => setSelectedNote(note.id)}>
                <Link
                  href={`/notes/${pathname.includes("edit") ? "edit/" : ""}${
                    note.id
                  }`}
                  className={`text-sm flex items-center gap-2 ${
                    selectedNote == note.id ? "font-semibold" : ""
                  }`}
                >
                  <NoteIcon
                    className={`size-4 ${
                      selectedNote == note.id ? "text-accent" : "text-primary"
                    }`}
                  />
                  {truncateString(note.title, 24)}
                </Link>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
