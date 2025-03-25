"use client";

import { useToast } from "@/hooks/useToast";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

import ImageIcon from "@/icons/ImageIcon";
import Image from "next/image";
import DeleteIcon from "@/icons/DeleteIcon";
import ChangeIcon from "@/icons/ChangeIcon";
import { Input } from "./ui/input";
import {
  addNoteImage,
  deleteNoteImage,
  removeImageFromStorage,
  updateNoteImage,
  uploadImageToStorage,
} from "@/lib/notesImages";
import { NoteImageType } from "@/lib/dbSchemas";

export interface UploadedImage {
  name: string;
  imageUrl: string;
  fileName: string;
}

interface ImageUploaderProps {
  onRemoveUploader: () => void;
  index: number;
  startNoteImageData?: NoteImageType;
}

export default function ImageUploader({
  onRemoveUploader,
  index,
  startNoteImageData,
}: ImageUploaderProps) {
  const [imageName, setImageName] = useState(startNoteImageData?.name || "");
  const [imageUrl, setImageUrl] = useState(startNoteImageData?.url || "");
  const [fileName, setFileName] = useState(
    startNoteImageData?.storageFileName || ""
  );
  const [oldImageName, setOldImageName] = useState(
    startNoteImageData?.name || ""
  );
  const [isNameInputFocused, setIsNameInputFocused] = useState(false);
  const [noteImageId, setNoteImageId] = useState<string>(
    startNoteImageData?.id || ""
  );

  const nameInputRef = useRef<null | HTMLInputElement>(null);

  const { showToast } = useToast();
  const { noteId }: { noteId: string } = useParams();

  const onDropRejected = useCallback(() => {
    showToast("Plik jest za duży! Maksymalny rozmiar to 5 MB.", "error");
  }, [showToast]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      (async function () {
        try {
          if (fileName) {
            await removeImageFromStorage(fileName);
          }
          setFileName(file.name);
          if (noteImageId) {
            const newImageUrl = await uploadImageToStorage(file);
            updateNoteImage(noteImageId, {
              url: newImageUrl,
              storageFileName: file.name,
            });
            setImageUrl(newImageUrl);
            return;
          }

          const { imageUrl: createdImageUrl, noteImageId: createdNoteImageId } =
            await addNoteImage(file, noteId);
          setImageUrl(createdImageUrl);
          setNoteImageId(createdNoteImageId);
          showToast("Zdjęcie zostało przesłane.", "success");
        } catch (err) {
          showToast("Błąd przesyłania zdjęcia", "error");
          console.error(err);
        }
      })();
    },
    [imageName, noteId, showToast]
  );

  useEffect(() => {
    if (isNameInputFocused || imageName === oldImageName || !noteImageId)
      return;
    (async function () {
      try {
        await updateNoteImage(noteImageId, { name: imageName });
        setOldImageName(imageName);
        showToast("Nazwa zdjęcia została zaktualizowana", "success");
      } catch (err) {
        showToast("Błąd zmiany nazwy zdjęcia", "error");
        console.error(err);
      }
    })();
  }, [isNameInputFocused]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,
  });

  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!imageUrl || !fileName) return;
    try {
      removeImageFromStorage(fileName);
      updateNoteImage(noteImageId, { storageFileName: "", url: "" });
      setImageUrl("");
      setFileName("");
      showToast("Obrazek został usunięty", "success");
    } catch (error) {
      showToast("Błąd usuwania obrazka", "error");
      console.error("Błąd usuwania obrazka:", error);
    }
  };

  const handleDeleteUploader = async () => {
    onRemoveUploader();
    if (noteImageId) {
      try {
        deleteNoteImage(noteImageId);
        removeImageFromStorage(fileName);
        showToast("Obraz został usunięty z notatki", "success");
      } catch (err) {
        showToast("Błąd usuwania obrazu z notatki", "error");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded text-center cursor-pointer w-full aspect-[3/2] flex items-center justify-center relative"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Upuść obrazek tutaj...</p>
        ) : !imageUrl ? (
          <div className="flex items-center gap-4 m-4">
            <ImageIcon className="size-20 hidden sm:block" />
            <p className="text-left">
              Przeciągnij i upuść obrazek lub kliknij, aby wybrać
            </p>
          </div>
        ) : (
          <>
            <Image
              src={imageUrl}
              alt="Uploaded image"
              layout="fill"
              className="w-full aspect-[3/2] object-contain"
            />
            <div className="text-3xl z-10 w-full h-full bg-transparent backdrop-brightness-100 items-center justify-center flex relative transition-all ease-in-out opacity-0 hover:backdrop-brightness-[25%] hover:opacity-100">
              <button
                className="absolute right-0 top-0 m-2 hover:text-destructive"
                onClick={handleDeleteImage}
              >
                <DeleteIcon className="size-8 " />
              </button>
              <button className="hover:text-accent">
                <ChangeIcon className="size-12 " />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          maxLength={48}
          placeholder="nazwa zdjęcia"
          ref={nameInputRef}
          onFocus={() => setIsNameInputFocused(true)}
          onBlur={() => setIsNameInputFocused(false)}
        />
        {index !== 0 && (
          <button
            className="hover:text-destructive"
            onClick={handleDeleteUploader}
          >
            <DeleteIcon className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}
