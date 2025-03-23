import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { NoteType } from "./dbSchemas";

export async function getNoteById(noteId: string): Promise<NoteType | null> {
  const noteDocument = await getDoc(doc(db, "notes", noteId));

  if (!noteDocument.data()) {
    return null;
  }

  const note = noteDocument.data() as NoteType;

  return {
    id: note.id,
    parentFolderRef: note.parentFolderRef,
    title: note.title,
    mdContent: note.mdContent,
  };
}

export type NoteMetadata = Pick<NoteType, "id" | "title" | "parentFolderRef">;

export async function getNotesMetadata(): Promise<NoteMetadata[]> {
  const notesSnapshot = await getDocs(collection(db, "notes"));
  const notesMetadata = notesSnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    parentFolderRef: doc.data().parentFolderRef,
  }));

  return notesMetadata;
}

export async function getNotesFromFolderMetadata(
  folderRef: DocumentReference<DocumentData, DocumentData>
): Promise<NoteMetadata[]> {
  const q = query(
    collection(db, "notes"),
    where("parentFolderRef", "==", folderRef)
  );

  const snapshot = await getDocs(q);

  const notesMetadata = snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    parentFolderRef: doc.data().parentFolderRef,
  }));

  return notesMetadata;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
}

export async function updateNote(
  noteId: string,
  data: UpdateNoteData
): Promise<void> {
  const noteRef = doc(db, "notes", noteId);
  const updateData: { title?: string; mdContent?: string } = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.content !== undefined) {
    updateData.mdContent = data.content;
  }

  if (Object.keys(updateData).length > 0) {
    await updateDoc(noteRef, updateData);
  }
}

export async function createNote(
  parentFolderId: string,
  noteTitle?: string
): Promise<string> {
  const collectionRef = collection(db, "notes");
  const newDocRef = doc(collectionRef);
  const noteId = newDocRef.id;

  const parentFolderRef = doc(db, "folders", parentFolderId);

  const newNoteData: NoteType = {
    id: noteId,
    title: noteTitle || "nowa notatka",
    mdContent: "",
    parentFolderRef,
  };

  await setDoc(newDocRef, newNoteData);

  return noteId;
}
