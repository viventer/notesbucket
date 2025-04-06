"use server";

import { redirect } from "next/navigation";
import { checkIfAuthorized } from "./auth";
import { NoteImageType, NoteType, SerializedNoteImageType } from "./dbSchemas";
import { adminDB, adminStorage } from "./firebaseAdmin";
import { revalidatePath } from "next/cache";

/**
 * Dodaje obraz notatki – zapisuje plik w Storage i dodaje dokument do Firestore.
 * @param buffer - zawartość pliku jako Buffer
 * @param fileName - nazwa pliku (np. "obraz.png")
 * @param contentType - typ MIME (np. "image/png")
 * @param noteId - identyfikator notatki, do której obraz należy
 * @returns obiekt zawierający URL obrazu oraz ID dokumentu obrazu
 */
export async function addNoteImage(
  bufferString: string,
  fileName: string,
  contentType: string,
  noteId: string
): Promise<{ imageUrl: string; noteImageId: string }> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const imageUrl = await uploadImageToStorage(
    bufferString,
    fileName,
    contentType
  );

  const noteRef = adminDB.collection("notes").doc(noteId);

  const docRef = await adminDB.collection("notesImages").add({
    name: "",
    url: imageUrl,
    noteRef: noteRef,
    storageFileName: fileName,
  });

  await docRef.update({ id: docRef.id });

  revalidatePath(`/notes/edit/${noteId}`);
  return { imageUrl, noteImageId: docRef.id };
}

/**
 * Uploaduje obraz do Cloud Storage przy użyciu Firebase Admin SDK.
 * @param buffer - zawartość pliku jako Buffer
 * @param fileName - nazwa pliku (np. "obraz.png")
 * @param contentType - typ MIME (np. "image/png")
 * @returns publiczny URL obrazu
 */
export async function uploadImageToStorage(
  bufferString: string,
  fileName: string,
  contentType: string
): Promise<string> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const bucket = adminStorage.bucket(
    "notesbucket-firebase.firebasestorage.app"
  );
  const filePath = `images/${fileName}`;
  const fileRef = bucket.file(filePath);

  const buffer = Buffer.from(bufferString, "base64");

  await fileRef.save(buffer, {
    metadata: { contentType },
  });

  await fileRef.makePublic();

  return fileRef.publicUrl();
}

export async function updateNoteImage(
  id: string,
  data: Partial<NoteImageType>
) {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const docRef = adminDB.collection("notesImages").doc(id);
  await docRef.update(data);

  const note = (await docRef.get()).data() as NoteType;

  revalidatePath(`/notes/edit/${note.id}`);
}

export async function removeImageFromStorage(fileName: string) {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const bucket = adminStorage.bucket(
    "notesbucket-firebase.firebasestorage.app"
  );
  const filePath = `images/${fileName}`;
  const fileRef = bucket.file(filePath);
  await fileRef.delete();
}

export async function deleteNoteImage(noteImageId: string) {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const noteImageRef = adminDB.collection("notesImages").doc(noteImageId);
  if (!noteImageRef) {
    throw new Error("Nie ma obrazu do usunięcia.");
  }

  const noteImage = (await noteImageRef.get()).data() as NoteImageType;
  const noteId = noteImage.noteRef.id;

  await noteImageRef.delete();

  revalidatePath(`/notes/edit/${noteId}`);
}

export async function getNoteImage(
  noteImageId: string
): Promise<SerializedNoteImageType> {
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

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
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

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
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

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
