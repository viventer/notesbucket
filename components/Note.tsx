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
    <div>
      <h1>{title}</h1>
      {content}
    </div>
  );
}
