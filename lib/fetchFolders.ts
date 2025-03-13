import { FolderSchema, FolderType } from "@/lib/dbSchemas";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchFolders() {
  const foldersSnapshot = await getDocs(collection(db, "folders"));
  const initialFolders = foldersSnapshot.docs.map((doc) => ({
    ...FolderSchema.parse(doc.data()),
  }));

  const folderMap = new Map<string, FolderType>();
  const rootFolders: FolderType[] = [];

  initialFolders.forEach((folder) => folderMap.set(folder.id, folder));

  initialFolders.forEach((folder) => {
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

  console.log("fetching folders");

  return rootFolders as FolderType[];
}
