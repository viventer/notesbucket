import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { NoteType } from "./dbSchemas";
import { remark } from "remark";
import html from "remark-html";

export async function getNoteById(noteId: string): Promise<NoteType> {
  const noteDocument = await getDoc(doc(db, "notes", noteId));

  const note = noteDocument.data() as NoteType;

  const rawMdContent = note.mdContent;

  const processedMdContent = await remark().use(html).process(rawMdContent);
  const contentHtml = processedMdContent.toString();

  return {
    id: note.id,
    parentFolderRef: note.parentFolderRef,
    title: note.title,
    mdContent: contentHtml,
  };
}

type NoteMetadata = Pick<NoteType, "id" | "title">;

export async function getNotesMetadata(): Promise<NoteMetadata[]> {
  const notesSnapshot = await getDocs(collection(db, "notes"));
  const notesMetadata = notesSnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
  }));

  return notesMetadata;
}
