"use server";

import {
  FolderSchema,
  FolderType,
  SerializedFolderType,
} from "@/lib/dbSchemas";

import { adminDB } from "./firebaseAdmin";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { serializeFolder } from "./serializing";

export async function getAllFolders(): Promise<SerializedFolderType[]> {
  console.log("getAllFolders");

  const foldersSnapshot = await adminDB.collection("folders").get();
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

  const serializedRootFolders: SerializedFolderType[] = rootFolders.map(
    (folder) => serializeFolder(folder)
  );

  return serializedRootFolders;
}

export async function getFolderData(
  folderId: string
): Promise<SerializedFolderType> {
  console.log("getFolderData");
  const folderSnapshot = await adminDB
    .collection("folders")
    .doc(folderId)
    .get();
  const folderData = folderSnapshot.data() as FolderType;
  if (!folderData) {
    throw new Error("Nie znaleziono folderu o podanym id.");
  }
  const serializedFolderData = serializeFolder(folderData);

  return serializedFolderData;
}

export type CreateFolderData = Pick<
  FolderType,
  "name" | "category" | "subject"
> & {
  parentFolderId?: string;
};

export async function createFolder(data: CreateFolderData): Promise<string> {
  console.log("createFolder");

  const newDocRef = adminDB.collection("folders").doc();
  const folderId = newDocRef.id;
  const { name, category, subject, parentFolderId } = data;

  let parentFolderRef;
  if (parentFolderId) {
    parentFolderRef = adminDB
      .collection("folders")
      .doc(parentFolderId) as unknown as DocumentReference<
      DocumentData,
      DocumentData
    >;
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

  await newDocRef.set(newFolderData);

  revalidatePath("/notes");

  return folderId;
}

export async function updateFolder(
  folderId: string,
  data: Partial<FolderType>
) {
  console.log("updateFolder");
  const folderRef = adminDB.collection("folders").doc(folderId);

  await folderRef.update(data);
  revalidatePath("/notes");
}

export async function deleteFolder(folderId: string) {
  await adminDB.collection("folders").doc(folderId).delete();

  revalidatePath("/notes");
}
