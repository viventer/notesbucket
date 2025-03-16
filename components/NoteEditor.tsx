"use client";

import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { updateNote } from "@/lib/notes";
import { on } from "events";

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
  const [isInputFocused, setIsInputfocused] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const noteId = pathname.split("/").pop() as string;

  useEffect(() => {
    if (isInputFocused === true || title === startTitle) {
      return;
    }
    (async function () {
      await updateNote(noteId, { title });
    })();
  }, [isInputFocused]);

  return (
    <>
      <Input
        type="text"
        placeholder="tytuł notatki"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl mb-4 max-w-[400px] md:translate-y-[-100%] md:mb-0"
        maxLength={48}
        onFocus={() => setIsInputfocused(true)}
        onBlur={() => setIsInputfocused(false)}
        ref={titleInputRef}
      />
      <MonacoEditor
        height="70vh"
        language="markdown"
        value={content}
        theme="vs-dark"
        onChange={(value) => {
          setContent(value || "");
        }}
        options={{
          autoIndent: "full",
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          lineNumbersMinChars: 4,
        }}
      />
    </>
  );
}
