import Note from "@/components/Note";
import { NoteType } from "@/lib/dbSchemas";
import { getNoteById } from "@/lib/notes";
import { notFound } from "next/navigation";

export const revalidate = 86400;

type Props = {
  params: {
    noteId: string;
  };
};

export async function generateMetadata({ params: { noteId } }: Props) {
  const note: NoteType = await getNoteById(noteId);

  if (!note) {
    return {
      title: "Note not found",
    };
  }

  return {
    tile: note.title,
  };
}

export default async function page({ params: { noteId } }: Props) {
  const note: NoteType = await getNoteById(noteId);

  if (!note) notFound();

  const { title, mdContent } = note;

  return <Note mode="view" title={title} content={mdContent} />;
}
