import ActionButtons from "@/components/ActionButtons";
import Note from "@/components/Note";
import { SerializedNoteType } from "@/lib/dbSchemas";
import { getNoteById } from "@/lib/notes";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 86400;

const cachedGetNoteById = cache(getNoteById);

type Props = {
  params: Promise<{ noteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function Page(props: Props) {
  const { noteId } = await props.params;

  const note: SerializedNoteType | null = await cachedGetNoteById(noteId);

  if (!note) {
    notFound();
  }

  const { title, mdContent } = note;

  return (
    <>
      <ActionButtons noteContent={mdContent} mode="view" />
      <Note mode="view" title={title} content={mdContent} />
    </>
  );
}
