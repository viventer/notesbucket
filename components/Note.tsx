import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Note({
  mode,
  title,
  content,
}: {
  mode: "view" | "edit";
  title: string;
  content: string;
}) {
  return (
    <article className="mb-[4rem] prose bg-background max-w-[1500px] xl:px-8 xl:py-6 xl:bg-card h-[80svh] sm:mb-[2rem] overflow-auto scrollbar-track-transparent scrollbar-thumb-primary scrollbar pr-2">
      <h2>{title}</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
