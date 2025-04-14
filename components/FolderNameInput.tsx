"use client";

import Save from "@/icons/Save";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/useToast";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { updateFolder } from "@/lib/folders";

export default function FolderNameInput({
  startFolderName,
  setNewFolderName,
  newFolderName,
  folderId,
  isNew,
  setShowNameInput,
}: {
  startFolderName: string;
  setNewFolderName: Dispatch<SetStateAction<string>>;
  newFolderName: string;
  folderId: string;
  isNew: boolean;
  setShowNameInput: Dispatch<SetStateAction<boolean>>;
}) {
  const nameInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (isNew && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isNew]);

  const { showToast } = useToast();
  const [previousFolderName, setPreviousFolderName] = useState(startFolderName);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };
  const saveNameChange = async () => {
    if (previousFolderName === newFolderName) {
      showToast("Nowa nazwa folderu jest taka sama jak stara.", "error");
      return;
    }

    try {
      await updateFolder(folderId, { name: newFolderName });
      showToast("Nazwa folderu została zmieniona.", "success");
      setShowNameInput(false);
      setPreviousFolderName(newFolderName);
    } catch (err) {
      showToast(`Błąd zmiany nazwy folderu: ${err}`, "error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={newFolderName}
        className="p-0 h-fit"
        onChange={handleNameChange}
        ref={nameInputRef}
        maxLength={48}
      />
      <button onClick={saveNameChange} className="hover:text-success">
        <Save className="size-4 " />
      </button>
    </div>
  );
}
