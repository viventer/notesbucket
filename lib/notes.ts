"use server";

import { adminDB } from "./firebaseAdmin";
import { NoteType, SerializedNoteType } from "./dbSchemas";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { checkIfAuthorized } from "./auth";
import { redirect } from "next/navigation";
import { checkRateLimit } from "./rateLimit";

export type NoteMetadata = Pick<
  SerializedNoteType,
  "id" | "title" | "parentFolderId"
>;

export async function getNoteById(
  noteId: string
): Promise<SerializedNoteType | null> {
  checkRateLimit();

  console.log("getNoteById");
  const isAuthorized = await checkIfAuthorized(["verified", "admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const noteDoc = await adminDB.collection("notes").doc(noteId).get();

  if (!noteDoc.exists) {
    return null;
  }

  const note = noteDoc.data() as NoteType;

  return {
    id: noteDoc.id,
    parentFolderId: note.parentFolderRef ? note.parentFolderRef.id : null,
    title: note.title,
    mdContent: note.mdContent,
  };
}

export async function getNotesMetadata(): Promise<NoteMetadata[]> {
  console.log("getNotesMetadata");
  const isAuthorized = await checkIfAuthorized(["verified", "admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const snapshot = await adminDB.collection("notes").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      parentFolderId: data.parentFolderRef ? data.parentFolderRef.id : null,
    };
  });
}

export async function getNotesFromFolderMetadata(
  folderId: string
): Promise<NoteMetadata[]> {
  console.log("getNotesFromFolderMetadata");
  const isAuthorized = await checkIfAuthorized(["verified", "admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  const folderRef = adminDB.collection("folders").doc(folderId);

  const snapshot = await adminDB
    .collection("notes")
    .where("parentFolderRef", "==", folderRef)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      parentFolderId: data.parentFolderRef ? data.parentFolderRef.id : null,
    };
  });
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  parentFolderId?: string;
}

export async function updateNote(
  noteId: string,
  data: UpdateNoteData
): Promise<void> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  const noteRef = adminDB.collection("notes").doc(noteId);
  const updateData: {
    title?: string;
    mdContent?: string;
    parentFolderRef?: DocumentReference<DocumentData, DocumentData>;
  } = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.content !== undefined) {
    updateData.mdContent = data.content;
  }
  if (data.parentFolderId !== undefined) {
    updateData.parentFolderRef = adminDB
      .collection("folders")
      .doc(data.parentFolderId) as unknown as DocumentReference<
      DocumentData,
      DocumentData
    >;
  }

  if (Object.keys(updateData).length > 0) {
    await noteRef.update(updateData);
  }

  if (data.title !== undefined || data.parentFolderId !== undefined) {
    revalidatePath("/notes");
  } else {
    revalidatePath(`/notes/edit/${noteId}`);
  }
}

export async function createNote(
  parentFolderId: string,
  noteTitle?: string
): Promise<string> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  const noteRef = adminDB.collection("notes").doc();
  const noteId = noteRef.id;
  const parentFolderRef = adminDB
    .collection("folders")
    .doc(parentFolderId) as unknown as DocumentReference<
    DocumentData,
    DocumentData
  >;

  const newNoteData: NoteType = {
    id: noteId,
    title: noteTitle || "nowa notatka",
    mdContent: "",
    parentFolderRef,
  };

  await noteRef.set(newNoteData);

  revalidatePath("/notes");

  return noteId;
}

export async function deleteNote(noteId: string): Promise<void> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }
  await adminDB.collection("notes").doc(noteId).delete();

  revalidatePath("/notes");
}
