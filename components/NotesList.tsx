"use client";

import { getNotesFromFolderMetadata, NoteMetadata } from "@/lib/notes";
import { SetStateAction, useEffect, useState } from "react";
import NoteFromList from "./NoteFromList";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type NotesListProps = {
  setSelectedNote: (value: SetStateAction<string>) => void;
  selectedNote: string;
  folderId: string;
  notes: NoteMetadata[];
  setNotes: (value: SetStateAction<NoteMetadata[]>) => void;
  isVisible: boolean;
};

export default function NotesList({
  setSelectedNote,
  selectedNote,
  folderId,
  notes,
  setNotes,
  isVisible,
}: NotesListProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      setLoading(true);
      const folderRef = doc(db, "folders", folderId);

      const rawNotesData = await getNotesFromFolderMetadata(folderRef);

      const notesData = rawNotesData.toSorted((a, b) =>
        a.title.localeCompare(b.title)
      );

      setNotes(notesData);
      setLoading(false);
    })();
  }, [folderId]);

  return (
    <div
      className={`ml-4 flex flex-col gap-1 mt-1 ${isVisible ? "" : "hidden"}`}
    >
      {loading && <span>Ładowanie notatek...</span>}
      {notes.map((note) => (
        <NoteFromList
          key={note.id}
          note={note}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
        />
      ))}
    </div>
  );
}
