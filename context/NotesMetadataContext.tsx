"use client";

import { createContext, useContext } from "react";
import { NoteMetadata } from "@/lib/notes";

interface NotesMetadataContextType {
  notesMetadata: NoteMetadata[];
}

const NotesMetadataContext = createContext<
  NotesMetadataContextType | undefined
>(undefined);

export function NotesMetadataProvider({
  notesMetadata,
  children,
}: {
  notesMetadata: NoteMetadata[];
  children: React.ReactNode;
}) {
  return (
    <NotesMetadataContext.Provider value={{ notesMetadata }}>
      {children}
    </NotesMetadataContext.Provider>
  );
}

export function useNotesMetadata() {
  const context = useContext(NotesMetadataContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
