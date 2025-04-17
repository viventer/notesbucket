"use client";

import { getNotesFromFolderMetadata, NoteMetadata } from "@/lib/notes";
import { useEffect, useState } from "react";
import NoteFromList from "./NoteFromList";
import { useToast } from "@/hooks/useToast";

type NotesListProps = {
  folderId: string;
  isVisible: boolean;
  notesMetadata: NoteMetadata[] | null;
};

export default function NotesList({
  folderId,
  isVisible,
  notesMetadata,
}: NotesListProps) {
  const [sortedNotes, setSortedNotes] = useState<null | NoteMetadata[]>(null);

  useEffect(() => {
    if (!notesMetadata) return;
    const filtered = notesMetadata
      .filter((n) => n.parentFolderId === folderId)
      .toSorted((a, b) => a.title.localeCompare(b.title));
    setSortedNotes(filtered);
  }, [notesMetadata, folderId]);

  return (
    <div
      className={`ml-4 flex flex-col gap-1 mt-1 ${isVisible ? "" : "hidden"}`}
    >
      {sortedNotes
        ? sortedNotes.map((note) => (
            <NoteFromList key={note.id} note={note} folderId={folderId} />
          ))
        : "loading"}
    </div>
  );
}
