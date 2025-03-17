import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useToast } from "@/hooks/useToast";
import Image from "@/icons/Image";

export function ImageUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const { showToast } = useToast();
  const [uploadedImages, setUploadedImages] = useState();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      const storage = getStorage();
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Błąd przesyłania:", error);
          showToast("Błąd przesyłania obrazka", "error");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            showToast("Obrazek został przesłany", "success");
          });
        }
      );
    },
    [showToast]
  );

  const onDropRejected = useCallback(() => {
    showToast("Plik jest za duży! Maksymalny rozmiar to 5 MB.", "error");
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: "image/*",
    maxFiles: 1,
    maxSize: 3 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded p-4 text-center cursor-pointer w-full aspect-[3/2] flex items-center justify-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Upuść obrazek tutaj...</p>
        ) : (
          <div className="flex items-center gap-4">
            <Image className="size-20" />
            <p className="text-left">
              Przeciągnij i upuść obrazek lub kliknij, aby wybrać
            </p>
          </div>
        )}
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <p>Postęp przesyłania: {Math.round(uploadProgress)}%</p>
      )}
      {downloadURL && (
        <a
          href={downloadURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Zobacz przesłany obrazek
        </a>
      )}
    </div>
  );
}
