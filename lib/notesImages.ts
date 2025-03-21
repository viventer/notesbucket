import {
  deleteDoc,
  doc,
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
  uploadBytes,
} from "firebase/storage";
import { db } from "./firebase";
import { NoteImageType } from "./dbSchemas";

export async function addNoteImage(
  file: File,
  noteId: string
): Promise<{ imageUrl: string; noteImageId: string }> {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(snapshot.ref);

  const noteRef = doc(db, "notes", noteId);
  const docRef = await addDoc(collection(db, "notesImages"), {
    name: "",
    url: imageUrl,
    noteRef: noteRef,
    storageFileName: file.name,
  });
  await updateNoteImage(docRef.id, { id: docRef.id });

  return { imageUrl, noteImageId: docRef.id };
}

export async function uploadImageToStorage(file: File): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(snapshot.ref);

  return imageUrl;
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
    storageFileName: doc.data().storageFileName,
  }));

  return notesImages;
}
