"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FolderType, SerializedFolderType } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import { truncateString } from "@/lib/utils";
import CancelIcon from "@/icons/CancelIcon";
import CreateFolderButton from "./CreateFolderButton";
import EditIcon from "@/icons/EditIcon";
import { useIsEditView } from "@/hooks/useIsEditView";
import NotesList from "./NotesList";
import CreateNoteButton from "./CreateNoteButton";
import FolderNameInput from "./FolderNameInput";
import DeleteFolderButton from "./DeleteFolderButton";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeFolder } from "@/lib/serializing";
import { getNotesFromFolderMetadata, NoteMetadata } from "@/lib/notes";
import { useToast } from "@/hooks/useToast";

interface FolderProps {
  folder: SerializedFolderType;
  isNew: boolean;
  isToSelect?: boolean;
  setSelectedFolder?: Dispatch<SetStateAction<string>>;
  selectedFolder?: string;
  isParentFolderExpanded?: boolean;
}

export default function Folder({
  folder,
  isNew,
  isToSelect,
  setSelectedFolder,
  selectedFolder,
  isParentFolderExpanded,
}: FolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNameInput, setShowNameInput] = useState(isNew);
  const [newFolderName, setNewFolderName] = useState(folder.name);

  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const truncatedFolderName = truncateString(newFolderName, 24);
  const isEditView = useIsEditView();

  const [serializedSubFolders, setSerializedSubFolders] = useState<
    SerializedFolderType[]
  >([]);

  useEffect(() => {
    (async () => {
      const rootFolderRef = doc(db, "folders", folder.id);

      const q = query(
        collection(db, "folders"),
        where("parentFolderRef", "==", rootFolderRef)
      );
      const subFoldersSnapshot = await getDocs(q);
      const subFolders = subFoldersSnapshot.docs.map((doc) =>
        doc.data()
      ) as FolderType[];

      const serializedSubFoldersData = subFolders.map((folder) =>
        serializeFolder(folder)
      );

      const sortedFolders = serializedSubFoldersData.toSorted((a, b) =>
        a.name.localeCompare(b.name)
      );

      setSerializedSubFolders(sortedFolders);
    })();
  }, [folder.id, folder.subFoldersIds]);

  const handleFolderNameClick = () => {
    if (isToSelect && setSelectedFolder) {
      setSelectedFolder(folder.id);
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  const { showToast } = useToast();

  const [notesMetadata, setNotesMetadata] = useState<null | NoteMetadata[]>(
    null
  );

  useEffect(() => {
    if (!isExpanded || notesMetadata) {
      return;
    }
    (async () => {
      try {
        const data = await getNotesFromFolderMetadata(folder.id);
        setNotesMetadata(data);
      } catch (err) {
        showToast(`Błąd pobierania: ${err}`, "error");
      }
    })();
  }, [isExpanded]);

  return (
    <div
      className={`${folder.parentFolderId ? "ml-4" : ""} ${
        !isParentFolderExpanded && folder.parentFolderId ? "hidden" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-base">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`${
            selectedFolder == folder.id
              ? "text-accent"
              : isNew
              ? "text-success"
              : "text-secondary"
          }`}
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
            <DeleteFolderButton folderId={folder.id} />
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
              onClick={handleFolderNameClick}
              className={`hover:cursor-pointer select-none ${
                selectedFolder == folder.id ? "font-semibold" : ""
              }`}
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
                  setNotesMetadata={setNotesMetadata}
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
              setNewFolderIds={setNewFolderIds}
              isSubFolder={true}
              parentFolderId={folder.id}
            />
          )}
        </>
      )}
      <div>
        {serializedSubFolders?.map((subFolder: SerializedFolderType) => (
          <Folder
            key={subFolder.id}
            folder={subFolder}
            isParentFolderExpanded={isExpanded}
            isNew={newFolderIds.includes(subFolder.id)}
          />
        ))}
      </div>
      {!isToSelect && isExpanded && (
        <NotesList
          folderId={folder.id}
          isVisible={isExpanded}
          notesMetadata={notesMetadata}
          setNotesMetadata={setNotesMetadata}
        />
      )}
    </div>
  );
}
