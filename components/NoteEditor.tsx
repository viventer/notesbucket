"use client";

import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { updateNote } from "@/lib/notes";
import { useToast } from "@/hooks/useToast";

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
  const { showToast } = useToast();

  useEffect(() => {
    if (isInputFocused === true || title === startTitle) {
      return;
    }
    (async function () {
      try {
        await updateNote(noteId, { title });
        showToast("Tytuł notatki został zaaktualizowany", "success");
      } catch (err) {
        showToast("Błąd aktualizacji tytułu", "error");
        console.error(err);
      }
    })();
  }, [isInputFocused]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        try {
          await updateNote(noteId, { content });
          showToast("Zmiany w zawartości zostały zapisane", "success");
        } catch (err) {
          showToast("Błąd aktualizacji zawartości", "error");
          console.error(err);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content]);

  return (
    <>
      <Input
        type="text"
        placeholder="tytuł notatki"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl mb-4 mt-2 max-w-[500px] md:translate-y-[-100%] md:m-0"
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
          padding: { top: 16, bottom: 16 },
          fontSize: 16,
        }}
      />
    </>
  );
}
