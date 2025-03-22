import { FolderSchema, FolderType } from "@/lib/dbSchemas";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export async function getAllFolders() {
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

export async function getFolderData(folderId: string): Promise<FolderType> {
  const folderRef = doc(db, "folders", folderId);
  const folderSnapshot = await getDoc(folderRef);
  const folderData = folderSnapshot.data() as FolderType;
  if (!folderData) {
    throw new Error("Nie znaleziono folderu o podanym id.");
  }

  return folderData;
}

export type CreateFolderData = Pick<
  FolderType,
  "name" | "category" | "subject"
> & {
  parentFolderId?: string;
};

export async function createFolder(data: CreateFolderData): Promise<string> {
  const collectionRef = collection(db, "folders");
  const newDocRef = doc(collectionRef);
  const folderId = newDocRef.id;
  const { name, category, subject, parentFolderId } = data;

  let parentFolderRef;
  if (parentFolderId) {
    parentFolderRef = doc(db, "folders", parentFolderId);
  }

  const newFolderData: FolderType = {
    id: folderId,
    name,
    parentFolderRef: parentFolderRef || null,
    subFoldersRefs: [],
    notesRefs: [],
    category,
    subject,
  };

  await setDoc(newDocRef, newFolderData);

  return folderId;
}

export async function updateFolder(
  folderId: string,
  data: Partial<FolderType>
) {
  const folderRef = doc(db, "folders", folderId);
  await updateDoc(folderRef, data);
}

export async function deleteFolder(folderId: string) {
  const folderRef = doc(db, "folders", folderId);
  await deleteDoc(folderRef);
}
