"use client";

import LocationIcon from "@/icons/LocationIcon";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import FoldersList from "./FoldersList";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateNote } from "@/lib/notes";
import { FolderType } from "@/lib/dbSchemas";

export default function ChangeNoteLocation({
  noteTitle,
  folderId,
  noteId,
}: {
  noteTitle: string;
  folderId: string;
  noteId: string;
}) {
  const [selectedFolder, setSelectedFolder] = useState(folderId);
  const [noteCategory, setNoteCategory] = useState<Category | null>(null);
  const [noteSubject, setNoteSubject] = useState<Subject | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const handleMoveNote = async () => {
    if (selectedFolder == folderId) {
      showToast("Notatka znajduje się już w tym folderze", "error");
    }
    try {
      const newFolderRef = doc(db, "folders", selectedFolder);
      await updateNote(noteId, { parentFolderId: newFolderRef.id });
      showToast("Notatka została przeniesiona", "success");
      setIsOpen(false);
    } catch (err) {
      showToast(`Błąd przenoszenia notatki: ${err}`, "error");
      console.error(err);
    }
  };

  useEffect(() => {
    (async function () {
      const oldFolderRef = doc(db, "folders", folderId);
      const oldFolder = await getDoc(oldFolderRef);
      const oldFolderData = oldFolder.data() as FolderType;
      setNoteCategory(oldFolderData.category);
      if (oldFolderData.category == "Szkoła") {
        setNoteSubject(oldFolderData.subject);
      }
    })();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className=" hover:text-accent">
          <LocationIcon className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] border-primary max-h-[90svh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LocationIcon className="size-6" />
            <p className="text-xl">{noteTitle}</p>
          </DialogTitle>
          <DialogDescription className="flex w-full">
            Przenieś notatkę do innego folderu
          </DialogDescription>
        </DialogHeader>
        <FoldersList
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          category={noteCategory as Category}
          subject={noteSubject}
        />
        <DialogFooter className="flex items-center gap-4 flex-row justify-end">
          <Button variant={"outline"} onClick={() => setIsOpen(false)}>
            Anuluj
          </Button>
          <Button type="submit" onClick={handleMoveNote} variant="default">
            Przenieś
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
