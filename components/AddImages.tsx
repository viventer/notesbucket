"use client";

import { useState } from "react";
import ImageUploader, { UploadedImage } from "./ImageUploader";

interface UploaderItem {
  id: number;
}

export function AddImages() {
  const [uploaders, setUploaders] = useState<UploaderItem[]>([{ id: 1 }]);
  // Obiekt, w którym kluczem jest id uploadera, a wartością przesłany obraz
  const [uploadedImages, setUploadedImages] = useState<{
    [key: number]: UploadedImage;
  }>({});

  const addUploader = () => {
    setUploaders((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
  };

  const removeUploader = (id: number) => {
    setUploaders((prev) => prev.filter((item) => item.id !== id));
    setUploadedImages((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // Callback wywoływany przez ImageUploader po przesłaniu obrazu
  const handleImageUpload = (uploaderId: number, data: UploadedImage) => {
    setUploadedImages((prev) => ({ ...prev, [uploaderId]: data }));
  };

  console.log(uploadedImages);

  return (
    <div className="flex flex-col gap-8">
      {uploaders.map((uploader, index) => (
        <ImageUploader
          key={uploader.id}
          index={index}
          onRemoveUploader={() => removeUploader(uploader.id)}
          onImageUpload={(data) => handleImageUpload(uploader.id, data)}
        />
      ))}
      <button
        className="font-bold px-2 py-1 border-dashed border-text border-[0.1rem]"
        onClick={addUploader}
      >
        Dodaj kolejny obrazek
      </button>

      {/* Przykładowe wyświetlenie zapamiętanych obrazów */}
      <div className="mt-4">
        <h3>Przesłane obrazy:</h3>
        <pre>{JSON.stringify(uploadedImages, null, 2)}</pre>
      </div>
    </div>
  );
}
