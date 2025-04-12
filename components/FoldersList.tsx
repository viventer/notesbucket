"use client";

import { FolderType, SerializedFolderType } from "@/lib/dbSchemas";
import { getAllFolders } from "@/lib/folders";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateFolderButton from "./CreateFolderButton";
import Folder from "./Folder";

export default function FoldersList({
  selectedFolder,
  setSelectedFolder,
  category,
  subject,
}: {
  selectedFolder: string;
  setSelectedFolder: Dispatch<SetStateAction<string>>;
  category: Category;
  subject: Subject | null;
}) {
  const [newFolderIds, setNewFolderIds] = useState<string[]>([]);
  const [sortedFolders, setSortedFolders] = useState<SerializedFolderType[]>(
    []
  );

  useEffect(() => {
    (async function () {
      try {
        const fetchedFolders = await getAllFolders();
        const filteredFolders = fetchedFolders.filter(
          (folder) =>
            folder.category === category &&
            (!subject || folder.subject === subject)
        );
        const sortedFolders = filteredFolders.toSorted((a, b) =>
          a.name.localeCompare(b.name)
        );

        setSortedFolders(sortedFolders);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="flex gap-2 flex-col overflow-auto max-h-full h-full">
      <CreateFolderButton
        isSubFolder={false}
        setNewFolderIds={setNewFolderIds}
      />
      <div className="mb-4 overflow-auto h-full scrollbar">
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
    </div>
  );
}
