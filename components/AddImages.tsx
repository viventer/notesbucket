"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { getAllNoteImages } from "@/lib/notesImages";
import { useParams } from "next/navigation";
import { NoteImageType } from "@/lib/dbSchemas";

type UploaderItem = {
  id: number;
  noteImageData?: NoteImageType;
};

export function AddImages() {
  const [uploaders, setUploaders] = useState<UploaderItem[]>([]);
  const { noteId }: { noteId: string } = useParams();

  useEffect(() => {
    (async function () {
      const noteImages = await getAllNoteImages(noteId);
      const noteImagesUploaders: UploaderItem[] = noteImages.map(
        (noteImage, index) => ({
          id: index,
          noteImageData: { ...noteImage },
        })
      );
      if (noteImagesUploaders.length > 0) {
        setUploaders([...noteImagesUploaders]);
      } else {
        setUploaders([{ id: 0 }]);
      }
    })();
  }, []);

  const addUploader = () => {
    setUploaders((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
  };

  const removeUploader = (id: number) => {
    setUploaders((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {uploaders.map((uploader, index) => (
        <ImageUploader
          key={uploader.id}
          index={index}
          onRemoveUploader={() => removeUploader(uploader.id)}
          startNoteImageData={uploader.noteImageData}
        />
      ))}
      <button
        className="font-bold px-2 py-1 border-dashed border-text border-[0.1rem]"
        onClick={addUploader}
      >
        Dodaj kolejny obrazek
      </button>
    </div>
  );
}
