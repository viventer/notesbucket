"use client";

import { NoteMetadata } from "@/lib/notes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import NoteFromList from "./NoteFromList";
import { useNotesMetadata } from "@/context/NotesMetadataContext";

type NotesListProps = {
  folderId: string;
  isVisible: boolean;
};

export default function NotesList({ folderId, isVisible }: NotesListProps) {
  const { notesMetadata }: { notesMetadata: NoteMetadata[] } =
    useNotesMetadata();
  const [sortedNotes, setSortedNotes] = useState<null | NoteMetadata[]>(null);

  useEffect(() => {
    const notesFromThisFolder = notesMetadata.filter(
      (note) => note.parentFolderId == folderId
    );

    const notesData = notesFromThisFolder.toSorted((a, b) =>
      a.title.localeCompare(b.title)
    );
    setSortedNotes(notesData);
  }, [notesMetadata]);

  return (
    <div
      className={`ml-4 flex flex-col gap-1 mt-1 ${isVisible ? "" : "hidden"}`}
    >
      {sortedNotes &&
        sortedNotes.map((note) => (
          <NoteFromList key={note.id} note={note} folderId={folderId} />
        ))}
    </div>
  );
}
