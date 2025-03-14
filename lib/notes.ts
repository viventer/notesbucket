import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { NoteSchema, NoteType } from "./dbSchemas";
import { remark } from "remark";
import html from "remark-html";

export async function getNoteById(noteId: string): Promise<NoteType | null> {
  const noteDocument = await getDoc(doc(db, "notes", noteId));

  if (!noteDocument.data()) {
    return null;
  }

  const note = noteDocument.data() as NoteType;

  const rawMdContent = note.mdContent;

  const processedMdContent = await remark().use(html).process(rawMdContent);
  const contentHtml = processedMdContent.toString();

  return {
    id: note.id,
    parentFolderRef: note.parentFolderRef,
    title: note.title,
    mdContent: rawMdContent,
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
