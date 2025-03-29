"use server";

import { adminDB } from "./firebaseAdmin"; // Plik inicjalizacyjny Admin SDK
import { NoteType, SerializedNoteType } from "./dbSchemas";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Typ pomocniczy do metadanych notatki
export type NoteMetadata = Pick<
  SerializedNoteType,
  "id" | "title" | "parentFolderId"
>;

// Pobieranie notatki po ID
export async function getNoteById(
  noteId: string
): Promise<SerializedNoteType | null> {
  console.log("getNoteById");
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

// Pobieranie metadanych notatek
export async function getNotesMetadata(): Promise<NoteMetadata[]> {
  console.log("getNotesMetadata");

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

// Pobieranie notatek na podstawie folderu
export async function getNotesFromFolderMetadata(
  folderId: string
): Promise<NoteMetadata[]> {
  console.log("getNotesFromFolderMetadata");
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

// Aktualizacja notatki
export async function updateNote(
  noteId: string,
  data: UpdateNoteData
): Promise<void> {
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

  if (data.title !== undefined) {
    revalidatePath("/notes");
  }
}

// Tworzenie notatki
export async function createNote(
  parentFolderId: string,
  noteTitle?: string
): Promise<string> {
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

  return noteId;

  revalidatePath("/notes");
}

// Usuwanie notatki
export async function deleteNote(noteId: string): Promise<void> {
  await adminDB.collection("notes").doc(noteId).delete();

  revalidatePath("/notes");
}
