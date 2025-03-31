"use client";

import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { updateNote } from "@/lib/notes";
import { useToast } from "@/hooks/useToast";
import { getAllNoteImages, getNoteImageUrl } from "@/lib/notesImages";
import { NoteImageType, SerializedNoteImageType } from "@/lib/dbSchemas";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function NoteEditor({
  startContent,
  startTitle,
  noteImages,
}: {
  startContent: string;
  startTitle: string;
  noteImages: SerializedNoteImageType[];
}) {
  const [content, setContent] = useState(startContent || "");
  const [newTitle, setNewTitle] = useState(startTitle || "");
  const [previousTitle, setPreviousTitle] = useState(startTitle || "");
  const [isInputFocused, setIsInputfocused] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const vimStatusRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const noteId = pathname.split("/").pop() as string;
  const { showToast } = useToast();

  useEffect(() => {
    setContent(startContent);
  }, [startContent]);

  useEffect(() => {
    if (isInputFocused || newTitle === previousTitle) return;
    (async function () {
      try {
        await updateNote(noteId, { title: newTitle });
        setPreviousTitle(newTitle);
        showToast("Tytuł notatki został zaaktualizowany", "success");
      } catch (err) {
        showToast("Błąd aktualizacji tytułu", "error");
        console.error(err);
      }
    })();
  }, [isInputFocused]);

  async function fillImageUrls(
    content: string,
    noteImages: SerializedNoteImageType[]
  ): Promise<string> {
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    let newContent = content;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const fullMatch = match[0];
      const imageName = match[1];
      const currentUrl = match[2];

      const image = noteImages.find((img) => img.name === imageName);
      if (image) {
        const newImageUrl = await getNoteImageUrl(image.id);
        if (newImageUrl !== currentUrl) {
          const newMarkdown = `![${imageName}](${newImageUrl})`;
          newContent = newContent.replace(fullMatch, newMarkdown);
        }
      }
    }
    return newContent;
  }

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        try {
          const newContent = noteImages
            ? await fillImageUrls(content, noteImages)
            : content;
          await updateNote(noteId, { content: newContent });
          showToast("Zmiany w zawartości zostały zapisane", "success");
        } catch (err) {
          showToast("Błąd aktualizacji zawartości", "error");
          console.error(err);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content, noteImages, noteId, showToast]);

  const handleEditorMount = (editor: any, monaco: any) => {
    if (typeof window !== "undefined" && (window as any).require) {
      (window as any).require.config({
        paths: {
          "monaco-vim": "https://unpkg.com/monaco-vim/dist/monaco-vim.js",
        },
      });

      (window as any).require(["monaco-vim"], (MonacoVim: any) => {
        if (vimStatusRef.current) {
          MonacoVim.initVimMode(editor, vimStatusRef.current);
          MonacoVim.VimMode.Vim.map("kj", "<Esc>", "insert");
        }
      });
    }
  };

  return (
    <>
      <Input
        type="text"
        placeholder="tytuł notatki"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="text-xl mb-4 mt-2 max-w-[500px] md:translate-y-[-100%] md:m-0"
        maxLength={48}
        onFocus={() => setIsInputfocused(true)}
        onBlur={() => setIsInputfocused(false)}
        ref={titleInputRef}
      />
      <article className="editor">
        <MonacoEditor
          height="65vh"
          language="markdown"
          value={content}
          theme="vs-dark"
          onMount={handleEditorMount}
          onChange={(value) => setContent(value || "")}
          options={{
            autoIndent: "full",
            minimap: { enabled: false },
            wordWrap: "on",
            lineNumbers: "on",
            lineNumbersMinChars: 4,
            padding: { top: 16, bottom: 16 },
            fontSize: 16,
            fontFamily: "Ubuntu mono, monospace",
          }}
        />
      </article>

      <div ref={vimStatusRef} className="vim-status mt-2 bg-background" />
    </>
  );
}
