"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FolderType, NoteSchema, NoteType } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import NoteIcon from "@/icons/NoteIcon";
import { truncateString } from "@/lib/utils";
import Link from "next/link";

interface FolderProps {
  folder: FolderType;
}

export default function Folder({ folder }: FolderProps) {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const truncatedFolderName = truncateString(folder.name, 24);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const folderRef = doc(db, "folders", folder.id);

      const q = query(
        collection(db, "notes"),
        where("parentFolderRef", "==", folderRef)
      );
      const snapshot = await getDocs(q);
      const notesData: NoteType[] = snapshot.docs.map((doc) => ({
        ...NoteSchema.parse(doc.data()),
      }));
      const sortedNotes = notesData.toSorted((a, b) =>
        a.title.localeCompare(b.title)
      );

      setNotes(sortedNotes);
      setLoading(false);
    }
    fetchNotes();
  }, []);

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
        {truncatedFolderName}
      </button>
      {isExpanded && (
        <>
          <div className="ml-4 flex flex-col gap-1 mt-1">
            {loading && <span>Ładowanie notatek...</span>}
            {notes.map((note) => (
              <button key={note.id} onClick={() => setSelectedNote(note.id)}>
                <Link
                  href={`/notes/${note.id}`}
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

          <div>
            {folder.children?.map((subFolder: FolderType) => (
              <Folder key={subFolder.id} folder={subFolder} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
