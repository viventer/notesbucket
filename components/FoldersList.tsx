"use client";

import { FolderType, SerializedFolderType } from "@/lib/dbSchemas";
import { getAllFolders } from "@/lib/folders";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateFolderButton from "./CreateFolderButton";
import Folder from "./Folder";

export default function FoldersList({
  selectedFolder,
  setSelectedFolder,
}: {
  selectedFolder: string;
  setSelectedFolder: Dispatch<SetStateAction<string>>;
}) {
  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const [sortedFolders, setSortedFolders] = useState<SerializedFolderType[]>(
    []
  );

  useEffect(() => {
    (async function () {
      try {
        const fetchedFolders = await getAllFolders();
        const sortedFolders = fetchedFolders.toSorted((a, b) =>
          a.name.localeCompare(b.name)
        );

        setSortedFolders(sortedFolders);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="flex gap-2 flex-col">
      <CreateFolderButton
        isSubFolder={false}
        setNewFolderIds={setNewFolderIds}
      />
      {sortedFolders.map((folder) => (
        <Folder
          key={folder.id}
          folder={folder}
          isNew={newFolderIds.includes(folder.id)}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          isToSelect={true}
        />
      ))}
    </div>
  );
}
