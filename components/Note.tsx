import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import NoteEditor from "./NoteEditor";
import { SerializedNoteImageType } from "@/lib/dbSchemas";

export default function Note({
  mode,
  title,
  content,
  noteImages,
}: {
  mode: "view" | "edit";
  title: string;
  content: string;
  noteImages?: SerializedNoteImageType[];
}) {
  return (
    <div className="z-0">
      {mode === "edit" && noteImages ? (
        <NoteEditor
          startContent={content}
          startTitle={title}
          noteImages={noteImages}
        />
      ) : (
        <article className="mb-[4rem] prose bg-background max-w-[1500px] xl:px-8 xl:py-8 xl:bg-card h-[75svh] sm:mb-[2rem] overflow-auto scrollbar-track-transparent scrollbar-thumb-primary scrollbar pr-2 mt-2">
          <h2>{title}</h2>
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p className="text-lg underline underline-offset-4 decoration-accent">
              Zawartość notatki nie została jeszcze uzupełniona.
            </p>
          )}
        </article>
      )}
    </div>
  );
}
