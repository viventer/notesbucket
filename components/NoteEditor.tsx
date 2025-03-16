"use client";

import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { useRef, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function NoteEditor({
  startContent,
  startTitle,
}: {
  startContent: string;
  startTitle: string;
}) {
  const [content, setContent] = useState(startContent || "");
  const [title, setTitle] = useState(startTitle || "");
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Input
        type="text"
        placeholder="tytuł notatki"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl mb-4"
        maxLength={48}
        ref={titleInputRef}
      />
      <MonacoEditor
        height="70vh"
        language="markdown"
        value={content}
        theme="vs-dark"
        onChange={(value) => {
          // Obsłuż zmianę zawartości, np. aktualizując stan lub wysyłając dane
          console.log("Nowa zawartość:", value);
        }}
      />
    </>
  );
}
