import ActionButtons from "@/components/ActionButtons";
import Note from "@/components/Note";
import { SerializedNoteImageType, SerializedNoteType } from "@/lib/dbSchemas";
import { getNoteById } from "@/lib/notes";
import { getAllNoteImages } from "@/lib/notesImages";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 86400;

const cachedGetNoteById = cache(getNoteById);

type Props = {
  params: {
    noteId: string;
  };
};

export async function generateMetadata(props: Props) {
  const { noteId } = await props.params;

  const note: SerializedNoteType | null = await cachedGetNoteById(noteId);

  if (!note) {
    return {
      title: "Note not found",
    };
  }

  return {
    title: note.title,
  };
}

export default async function page(props: Props) {
  const { noteId } = await props.params;
  const note: SerializedNoteType | null = await cachedGetNoteById(noteId);
  const noteImages: SerializedNoteImageType[] = await getAllNoteImages(noteId);

  if (!note) {
    notFound();
  }

  const { title, mdContent } = note;

  return (
    <>
      <ActionButtons noteContent={mdContent} mode="edit" />
      <Note
        mode="edit"
        title={title}
        content={mdContent}
        noteImages={noteImages}
      />
    </>
  );
}
