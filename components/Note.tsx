import { Card, CardTitle } from "./ui/card";

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
    <Card className="mt-[10rem]">
      <CardTitle>{title}</CardTitle>
      {content}
    </Card>
  );
}
