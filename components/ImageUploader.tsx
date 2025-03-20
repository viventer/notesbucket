"use client";

import { useToast } from "@/hooks/useToast";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";

import ImageIcon from "@/icons/ImageIcon";
import Image from "next/image";
import DeleteIcon from "@/icons/DeleteIcon";
import ChangeIcon from "@/icons/ChangeIcon";
import { Input } from "./ui/input";

export interface UploadedImage {
  imageName: string;
  imageUrl: string;
  fileName: string;
}

interface ImageUploaderProps {
  onRemoveUploader?: () => void;
  index: number;
  onImageUpload?: (data: UploadedImage) => void;
}

export default function ImageUploader({
  onRemoveUploader,
  index,
  onImageUpload,
}: ImageUploaderProps) {
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const { showToast } = useToast();
  const { noteId } = useParams();

  const onDropRejected = useCallback(() => {
    showToast("Plik jest za duży! Maksymalny rozmiar to 5 MB.", "error");
  }, [showToast]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setFileName(file.name);
      const storage = getStorage();
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Błąd przesyłania:", error);
          showToast("Błąd przesyłania obrazka", "error");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setImageUrl(url);
            showToast("Obrazek został przesłany", "success");

            // Zapis do Firestore
            if (!noteId) {
              console.error("Brak id notatki w URL");
              return;
            }
            const firestore = getFirestore();
            const noteRef = doc(firestore, "notes", noteId);
            try {
              const docRef = await addDoc(
                collection(firestore, "notesImages"),
                {
                  title: imageName,
                  url: url,
                  noteRef: noteRef,
                }
              );
              // Aktualizacja pola id zgodnie ze schematem
              await updateDoc(docRef, { id: docRef.id });
              onImageUpload &&
                onImageUpload({
                  imageName,
                  imageUrl: url,
                  fileName: file.name,
                });
            } catch (error) {
              console.error("Błąd zapisywania obrazu w Firestore:", error);
              showToast("Błąd zapisywania obrazu w bazie", "error");
            }
          });
        }
      );
    },
    [imageName, noteId, onImageUpload, showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,
  });

  // Usuwanie obrazka z Firebase Storage i ewentualne usuwanie zapisu w Firestore można rozszerzyć analogicznie.
  const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!imageUrl || !fileName) return;
    const storage = getStorage();
    const storageRef = ref(storage, `images/${fileName}`);
    try {
      await deleteObject(storageRef);
      setImageUrl("");
      setFileName("");
      showToast("Obrazek został usunięty", "success");
      // Powiadomienie rodzica o usunięciu obrazu (np. reset danych)
      onImageUpload &&
        onImageUpload({ imageName: "", imageUrl: "", fileName: "" });
    } catch (error) {
      console.error("Błąd usuwania obrazka:", error);
      showToast("Błąd usuwania obrazka", "error");
    }
  };

  useEffect(() => {
    if (imageUrl) {
      onImageUpload && onImageUpload({ imageName, imageUrl, fileName });
    }
  }, [imageName]);

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
                className="transition-all ease-in-out absolute right-0 top-0 m-2 hover:text-destructive"
                onClick={handleDeleteImage}
              >
                <DeleteIcon className="size-8 " />
              </button>
              <button className="transition-all ease-in-out hover:text-accent">
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
        />
        {onRemoveUploader && index !== 0 && (
          <button
            className="transition-all ease-in-out hover:text-destructive"
            onClick={onRemoveUploader}
          >
            <DeleteIcon className="size-6" />
          </button>
        )}
      </div>
    </div>
  );
}
