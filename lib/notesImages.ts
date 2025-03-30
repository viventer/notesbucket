"use server";

import { NoteImageType, SerializedNoteImageType } from "./dbSchemas";
import { adminDB, adminStorage } from "./firebaseAdmin";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function addNoteImage(
  file: File,
  noteId: string
): Promise<{ imageUrl: string; noteImageId: string }> {
  const imageUrl = await uploadImageToStorage(file);

  const noteRef = adminDB.collection("notes").doc(noteId);

  const docRef = await adminDB.collection("notesImages").add({
    name: "",
    url: imageUrl,
    noteRef: noteRef,
    storageFileName: file.name,
  });

  await docRef.update({ id: docRef.id });

  // Opcjonalnie możesz zarewalidować cache np. revalidatePath(`/notes/${noteId}`);
  return { imageUrl, noteImageId: docRef.id };
}

export async function uploadImageToStorage(file: File): Promise<string> {
  const bucket = adminStorage.bucket();
  const filePath = `images/${file.name}`;
  const fileRef = bucket.file(filePath);

  const buffer = Buffer.from(await file.arrayBuffer());

  await fileRef.save(buffer, {
    metadata: { contentType: file.type },
  });

  await fileRef.makePublic();

  return fileRef.publicUrl();
}

export async function updateNoteImage(
  id: string,
  data: Partial<NoteImageType>
) {
  const docRef = adminDB.collection("notesImages").doc(id);
  await docRef.update(data);
}

export async function removeImageFromStorage(fileName: string) {
  const bucket = adminStorage.bucket();
  const filePath = `images/${fileName}`;
  const fileRef = bucket.file(filePath);
  await fileRef.delete();
}

export async function deleteNoteImage(noteImageId: string) {
  await adminDB.collection("notesImages").doc(noteImageId).delete();
}

export async function getNoteImage(
  noteImageId: string
): Promise<SerializedNoteImageType> {
  const docSnapshot = await adminDB
    .collection("notesImages")
    .doc(noteImageId)
    .get();
  if (!docSnapshot.exists) {
    throw new Error("Dokument obrazu nie istnieje");
  }
  const { id, name, url, storageFileName, noteRef } =
    docSnapshot.data() as NoteImageType;

  return {
    id,
    name,
    url,
    storageFileName,
    noteId: noteRef.id,
  };
}

export async function getAllNoteImages(
  noteId: string
): Promise<SerializedNoteImageType[]> {
  const noteRef = adminDB.collection("notes").doc(noteId);
  const snapshot = await adminDB
    .collection("notesImages")
    .where("noteRef", "==", noteRef)
    .get();

  const notesImages: SerializedNoteImageType[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    noteId: noteRef.id,
    url: doc.data().url,
    storageFileName: doc.data().storageFileName,
  }));

  return notesImages;
}

export async function getNoteImageUrl(noteImageId: string): Promise<string> {
  const docSnapshot = await adminDB
    .collection("notesImages")
    .doc(noteImageId)
    .get();
  if (!docSnapshot.exists) {
    throw new Error("Dokument obrazu nie istnieje");
  }
  const data = docSnapshot.data() as NoteImageType;
  const storageFileName = data.storageFileName;
  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(`images/${storageFileName}`);
  return fileRef.publicUrl();
}
