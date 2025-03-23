"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FolderType } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import NoteIcon from "@/icons/NoteIcon";
import { truncateString } from "@/lib/utils";
import Link from "next/link";
import {
  createNote,
  getNoteById,
  getNotesFromFolderMetadata,
  NoteMetadata,
} from "@/lib/notes";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import Save from "@/icons/Save";
import CancelIcon from "@/icons/CancelIcon";
import { deleteFolder, updateFolder } from "@/lib/folders";
import { useToast } from "@/hooks/useToast";
import DeleteIcon from "@/icons/DeleteIcon";
import { useConfirmDialog } from "./ConfirmDialogProvider";
import CreateFolderButton from "./CreateFolderButton";
import EditIcon from "@/icons/EditIcon";
import AddNote from "@/icons/AddNote";

interface FolderProps {
  folder: FolderType;
  isNew: boolean;
}

export default function Folder({ folder, isNew }: FolderProps) {
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [showNameInput, setShowNameInput] = useState(isNew);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const [previousFolderName, setPreviousFolderName] = useState(folder.name);
  const [isDeleted, setIsDeleted] = useState(false);
  const [subFolders, setSubFolders] = useState(folder?.children || []);
  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const truncatedFolderName = truncateString(newFolderName, 24);
  const pathname = usePathname();
  const { showToast } = useToast();
  const { showDialog } = useConfirmDialog();
  const nameInputRef = useRef<null | HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const folderRef = doc(db, "folders", folder.id);

      const rawNotesData = await getNotesFromFolderMetadata(folderRef);

      const notesData = rawNotesData.toSorted((a, b) =>
        a.title.localeCompare(b.title)
      );

      setNotes(notesData);
      setLoading(false);
    }
    fetchNotes();

    if (isNew && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const isEditView = pathname.includes("edit");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };
  const saveNameChange = async () => {
    if (previousFolderName === newFolderName) {
      showToast("Nowa nazwa folderu jest taka sama jak stara.", "error");
      return;
    }

    try {
      await updateFolder(folder.id, { name: newFolderName });
      showToast("Nazwa folderu została zmieniona.", "success");
      setShowNameInput(false);
      setPreviousFolderName(newFolderName);
    } catch (err) {
      showToast(`Błąd zmiany nazwy folderu: ${err}`, "error");
      console.error(err);
    }
  };
  const handleDeleteFolder = () => {
    showDialog({
      message: "Czy na pewno chcesz usunąć folder?",
      description:
        "Wraz z folderem zniknie cała jego zawartość. Ta operacja jest nieodwracalna.",
      confirmText: "Tak",
      cancelText: "Nie",
      onConfirm: async () => {
        try {
          await deleteFolder(folder.id);
          setIsDeleted(true);
          showToast("Folder został usunięty.", "success");
        } catch (err) {
          showToast(`Błąd usuwania folderu: ${err}`, "error");
        }
      },
    });
  };

  const handleCreateNote = async () => {
    try {
      const createdNoteId = await createNote(folder.id);
      const createdNote = await getNoteById(createdNoteId);
      if (!createdNote) {
        throw new Error("Nie znaleziono nowej notatki w bazie.");
      }
      setNotes((prev) => [...prev, createdNote]);
      setSelectedNote(createdNoteId);
      router.push(`/notes/edit/${createdNoteId}`);
      showToast("Nowa notatka została utworzona.", "success");
    } catch (err) {
      showToast(`Błąd tworzenia notatki: ${err}`, "error");
    }
  };

  if (isDeleted) return;

  return (
    <div className={`${folder.parentFolderRef ? "ml-4" : ""}`}>
      <div className="flex items-center gap-2 text-base">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`${isNew ? "text-success" : "text-secondary"}`}
        >
          {isExpanded ? (
            <OpenedFolder className="size-4" />
          ) : (
            <ClosedFolder className="size-4" />
          )}
        </button>
        {showNameInput ? (
          <div className="flex items-center gap-2">
            <Input
              value={newFolderName}
              className="p-0 h-fit"
              onChange={handleNameChange}
              ref={nameInputRef}
              maxLength={48}
            />
            <button onClick={saveNameChange}>
              <Save className="size-4 transition-all ease-in-out hover:text-success" />
            </button>
            <button onClick={handleDeleteFolder}>
              <DeleteIcon className="size-4 transition-all ease-in-out hover:text-destructive" />
            </button>
            <button onClick={() => setShowNameInput(false)}>
              <CancelIcon className="size-4 transition-all ease-in-out hover:text-accent" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p
              onClick={() => setIsExpanded((prev) => !prev)}
              className="hover:cursor-pointer select-none"
            >
              {truncatedFolderName}
            </p>
            {isEditView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNameInput(true)}
                  className="hover:text-accent"
                >
                  <EditIcon className="size-4" />
                </button>
                <button
                  onClick={handleCreateNote}
                  className="hover:text-success"
                >
                  <AddNote className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isExpanded && (
        <>
          {isEditView && (
            <CreateFolderButton
              setUpdatedFolders={setSubFolders}
              setNewFolderIds={setNewFolderIds}
              isSubFolder={true}
              parentFolderId={folder.id}
            />
          )}
          <div>
            {subFolders?.map((subFolder: FolderType) => (
              <Folder
                key={subFolder.id}
                folder={subFolder}
                isNew={newFolderIds.includes(subFolder.id)}
              />
            ))}
          </div>

          <div className="ml-4 flex flex-col gap-1 mt-1">
            {loading && <span>Ładowanie notatek...</span>}
            {notes.map((note) => (
              <button key={note.id} onClick={() => setSelectedNote(note.id)}>
                <Link
                  href={`/notes/${isEditView ? "edit/" : ""}${note.id}`}
                  className={`text-sm flex items-center gap-2 ${
                    selectedNote == note.id ? "font-semibold" : ""
                  }`}
                >
                  <NoteIcon
                    className={`size-4 ${
                      selectedNote == note.id ? "text-accent" : "text-primary"
                    }`}
                  />
                  {truncateString(note.title, 24)}
                </Link>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
