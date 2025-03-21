"use server";

import {
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db } from "./firebase";
import { NoteImageType } from "./dbSchemas";

export async function addNoteImage(
  file: File,
  noteRef: DocumentReference
): Promise<{ imageUrl: string; docRef: DocumentReference } | never> {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  let imageUrl = "";
  let docRef: DocumentReference | null = null;

  uploadTask.on(
    "state_changed",
    () => {},
    () => {},
    async () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
        imageUrl = url;
      });

      docRef = await addDoc(collection(db, "notesImages"), {
        name: "",
        url: imageUrl,
        noteRef: noteRef,
      });
      await updateNoteImage(docRef.id, { id: docRef.id });
    }
  );

  if (imageUrl && docRef) {
    return { imageUrl, docRef };
  }

  throw new Error("Błąd dodawania obrazu do notatki");
}

export async function updateNoteImage(
  id: string,
  data: Partial<NoteImageType>
) {
  const docRef = doc(db, "notesImages", id);

  await updateDoc(docRef, { ...data });
}

export async function removeImageFromStorage(fileName: string) {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${fileName}`);
  await deleteObject(storageRef);
}

export async function deleteNoteImage(noteImageId: string) {
  const docRef = doc(db, "notesImages", noteImageId);

  await deleteDoc(docRef);
}

export async function getNoteImage(
  noteImageId: string
): Promise<NoteImageType> {
  const docRef = doc(db, "notesImages", noteImageId);
  const data = (await getDoc(docRef)).data() as NoteImageType;

  return {
    ...data,
  };
}

export async function getAllNoteImages(
  noteId: string
): Promise<NoteImageType[]> {
  const noteRef = doc(db, "notes", noteId);
  const q = query(
    collection(db, "notesImages"),
    where("noteRef", "==", noteRef)
  );

  const snapshot = await getDocs(q);

  const notesImages: NoteImageType[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    noteRef: doc.data().noteRef,
    url: doc.data().url,
  }));

  return notesImages;
}
