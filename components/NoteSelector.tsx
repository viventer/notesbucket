import { useEffect, useState } from "react";
import { collection, getDocs, DocumentReference } from "firebase/firestore";
import { FormField, FormItem } from "./ui/form";
import { db } from "@/lib/firebase";
import { z } from "zod";
import Folder from "./Folder";
import { FolderSchema } from "@/lib/dbSchemas";

export default function NoteSelector({ form }: { form: any }) {
  const [folders, setFolders] = useState<FolderData[]>([]);

  useEffect(() => {
    async function fetchFolders() {
      const querySnapshot = await getDocs(collection(db, "folders"));
      const folderList: FolderData[] = querySnapshot.docs.map((doc) => ({
        ...FolderSchema.parse(doc.data()),
      }));

      const folderMap = new Map<string, FolderData>();
      const rootFolders: FolderData[] = [];

      folderList.forEach((folder) => folderMap.set(folder.id, folder));

      folderList.forEach((folder) => {
        if (folder.parentFolderRef) {
          const parent = folderMap.get(folder.parentFolderRef.id);
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(folder);
          }
        } else {
          rootFolders.push(folder);
        }
      });

      setFolders(rootFolders);
    }

    fetchFolders();
  }, []);

  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem>
          {folders.map((folder) => (
            <Folder key={folder.id} folder={folder} />
          ))}
        </FormItem>
      )}
    />
  );
}
