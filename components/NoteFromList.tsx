import { useDeleteNote } from "@/hooks/useDeleteNote";
import { useIsEditView } from "@/hooks/useIsEditView";
import DeleteIcon from "@/icons/DeleteIcon";
import NoteIcon from "@/icons/NoteIcon";
import { NoteMetadata } from "@/lib/notes";
import { truncateString } from "@/lib/utils";
import Link from "next/link";
import React, { SetStateAction } from "react";
import ChangeNoteLocation from "./ChangeNoteLocation";

export default function NoteFromList({
  note,
  setSelectedNote,
  selectedNote,
  folderId,
}: {
  note: NoteMetadata;
  setSelectedNote: (value: SetStateAction<string>) => void;
  selectedNote: string;
  folderId: string;
}) {
  const { deleteNoteHandler } = useDeleteNote();
  const isEditView = useIsEditView();

  return (
    <div key={note.id} className="flex items-center gap-4">
      <button onClick={() => setSelectedNote(note.id)}>
        <Link
          href={`/notes/${isEditView ? "edit/" : ""}${note.id}`}
          className={`text-sm flex items-center gap-2 ${
            selectedNote == note.id ? "font-semibold" : ""
          }`}
        >
          <NoteIcon
            className={`size-4 ${
              selectedNote == note.id ? "text-accent" : "text-primary"
            }`}
          />
          <p>{truncateString(note.title, 24)}</p>
        </Link>
      </button>
      {isEditView && (
        <div className="flex items-center gap-2">
          <ChangeNoteLocation
            noteTitle={note.title}
            folderId={folderId}
            noteId={note.id}
          />
          <button
            onClick={() => deleteNoteHandler(note.id)}
            className=" hover:text-destructive"
          >
            <DeleteIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
