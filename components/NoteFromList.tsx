"use client";

import { useDeleteNote } from "@/hooks/useDeleteNote";
import { useIsEditView } from "@/hooks/useIsEditView";
import DeleteIcon from "@/icons/DeleteIcon";
import NoteIcon from "@/icons/NoteIcon";
import { NoteMetadata } from "@/lib/notes";
import { truncateString } from "@/lib/utils";
import Link from "next/link";
import ChangeNoteLocation from "./ChangeNoteLocation";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export default function NoteFromList({
  note,
  folderId,
}: {
  note: NoteMetadata;
  folderId: string;
}) {
  const { deleteNoteHandler } = useDeleteNote();
  const isEditView = useIsEditView();

  const { noteId: selectedNoteId }: { noteId: string } = useParams();

  return (
    <div key={note.id} className="flex items-center gap-4">
      <button>
        <Link
          href={`/notes/${isEditView ? "edit/" : ""}${note.id}`}
          className={`text-sm flex items-center gap-2 ${
            selectedNoteId == note.id ? "font-semibold" : ""
          }`}
        >
          <NoteIcon
            className={`size-4 ${
              selectedNoteId == note.id ? "text-accent" : "text-primary"
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
