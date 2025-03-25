"use client";

import { useState } from "react";
import { FolderType } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import { truncateString } from "@/lib/utils";
import { NoteMetadata } from "@/lib/notes";
import CancelIcon from "@/icons/CancelIcon";
import CreateFolderButton from "./CreateFolderButton";
import EditIcon from "@/icons/EditIcon";
import { useIsEditView } from "@/hooks/useIsEditView";
import NotesList from "./NotesList";
import CreateNoteButton from "./CreateNoteButton";
import FolderNameInput from "./FolderNameInput";
import DeleteFolderButton from "./DeleteFolderButton";

interface FolderProps {
  folder: FolderType;
  isNew: boolean;
}

export default function Folder({ folder, isNew }: FolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [showNameInput, setShowNameInput] = useState(isNew);
  const [newFolderName, setNewFolderName] = useState(folder.name);

  const [isDeleted, setIsDeleted] = useState(false);
  const [subFolders, setSubFolders] = useState(folder?.children || []);
  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const truncatedFolderName = truncateString(newFolderName, 24);
  const isEditView = useIsEditView();

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
            <FolderNameInput
              startFolderName={folder.name}
              setNewFolderName={setNewFolderName}
              newFolderName={newFolderName}
              folderId={folder.id}
              isNew={isNew}
              setShowNameInput={setShowNameInput}
            />
            <DeleteFolderButton
              folderId={folder.id}
              setIsDeleted={setIsDeleted}
            />
            <button
              onClick={() => setShowNameInput(false)}
              className="hover:text-accent"
            >
              <CancelIcon className="size-4" />
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
                <CreateNoteButton
                  folderId={folder.id}
                  setNotes={setNotes}
                  setSelectedNote={setSelectedNote}
                />
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
        </>
      )}
      <NotesList
        setSelectedNote={setSelectedNote}
        selectedNote={selectedNote}
        folderId={folder.id}
        notes={notes}
        setNotes={setNotes}
        isVisible={isExpanded}
      />
    </div>
  );
}
