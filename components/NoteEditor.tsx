"use client";

import dynamic from "next/dynamic";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { updateNote } from "@/lib/notes";
import { useToast } from "@/hooks/useToast";
import { getAllNoteImages } from "@/lib/notesImages";
import { NoteImageType } from "@/lib/dbSchemas";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

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
  const [noteImages, setNoteImages] = useState<null | NoteImageType[]>();
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const vimStatusRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const noteId = pathname.split("/").pop() as string;
  const { showToast } = useToast();

  useEffect(() => {
    (async function () {
      const uploadedNoteImages = await getAllNoteImages(noteId);
      console.log(uploadedNoteImages);
      setNoteImages([...uploadedNoteImages]);
    })();
  }, []);

  useEffect(() => {
    if (isInputFocused || title === startTitle) return;
    (async function () {
      try {
        await updateNote(noteId, { title });
        showToast("Tytuł notatki został zaaktualizowany", "success");
      } catch (err) {
        showToast("Błąd aktualizacji tytułu", "error");
        console.error(err);
      }
    })();
  }, [isInputFocused, title, startTitle, noteId, showToast]);

  async function getImageUrl(storageFileName: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `images/${storageFileName}`);
    return await getDownloadURL(imageRef);
  }

  async function fillImageUrls(
    content: string,
    noteImages: NoteImageType[]
  ): Promise<string> {
    const regex = /!\[(.*?)\]\(\)/g;
    const matches: { fullMatch: string; imageName: string }[] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      matches.push({ fullMatch: match[0], imageName: match[1] });
    }

    let newContent = content;
    for (const { fullMatch, imageName } of matches) {
      const image = noteImages.find((img) => img.name === imageName);
      let replacement = `[${imageName}]()`;
      if (image) {
        const imageUrl = await getImageUrl(image.storageFileName);
        replacement = `![${imageName}](${imageUrl})`;
      }
      newContent = newContent.replace(fullMatch, replacement);
    }
    return newContent;
  }

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        try {
          // Upewnij się, że noteImages zostały już załadowane
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
