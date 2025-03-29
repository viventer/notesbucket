"use client";

import { useToast } from "@/hooks/useToast";
import AddNote from "@/icons/AddNote";
import { SerializedNoteType } from "@/lib/dbSchemas";
import { createNote, getNoteById, NoteMetadata } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export default function CreateNoteButton({
  folderId,
  setNotes,
  setSelectedNote,
}: {
  folderId: string;
  setNotes: Dispatch<SetStateAction<NoteMetadata[]>>;
  setSelectedNote: Dispatch<SetStateAction<string>>;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleCreateNote = async () => {
    try {
      const createdNoteId = await createNote(folderId);
      const createdNote: SerializedNoteType | null = await getNoteById(
        createdNoteId
      );
      if (!createdNote) {
        throw new Error("Nie znaleziono nowej notatki w bazie.");
      }
      setNotes((prev) => [...prev, createdNote]);
      setSelectedNote(createdNoteId);
      router.push(`/notes/edit/${createdNoteId}`);
      showToast("Nowa notatka została utworzona.", "success");
    } catch (err) {
      showToast(`Błąd tworzenia notatki: ${err}`, "error");
    }
  };

  return (
    <button onClick={handleCreateNote} className="hover:text-success">
      <AddNote className="size-4" />
    </button>
  );
}
