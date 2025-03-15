import ActionButtons from "@/components/ActionButtons";
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

export async function generateMetadata(props: Props) {
  const { noteId } = await props.params;

  const note: NoteType | null = await getNoteById(noteId);

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
  const note: NoteType | null = await getNoteById(noteId);

  if (!note) {
    notFound();
  }

  const { title, mdContent } = note;

  return (
    <>
      <ActionButtons noteContent={mdContent} />
      <Note mode="view" title={title} content={mdContent} />
    </>
  );
}
