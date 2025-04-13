import { FileNode } from "./buildFileTree";
import {
  collection,
  doc,
  DocumentReference,
  getFirestore,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FolderSchema, FolderType, NoteSchema, NoteType } from "./dbSchemas";
import fs from "fs";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCPCwJbMLW7P8DOi0BhjvUQYm19rMMeYMM",
  authDomain: "notesbucket-firebase.firebaseapp.com",
  projectId: "notesbucket-firebase",
  storageBucket: "notesbucket-firebase.firebasestorage.app",
  messagingSenderId: "15492670104",
  appId: "1:15492670104:web:a091bad9d0c0749e53e6ed",
};

const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app);

/**
 * Funkcja rekurencyjna sprawdzająca, czy folder lub któryś z jego podfolderów zawiera jakiekolwiek notatki.
 * @param folderRef - odniesienie do dokumentu folderu.
 * @returns Promise<boolean> - true, jeśli w folderze lub w którymkolwiek z podfolderów są notatki.
 */
async function folderHasAnyNotes(
  folderRef: DocumentReference
): Promise<boolean> {
  const folderSnap = await getDoc(folderRef);
  if (!folderSnap.exists()) {
    return false;
  }

  const folderData = folderSnap.data() as FolderType;

  // Sprawdź, czy folder zawiera bezpośrednio notatki.
  if (folderData.notesRefs && folderData.notesRefs.length > 0) {
    return true;
  }

  // Jeśli są podfoldery, sprawdź każdy z nich rekurencyjnie.
  if (folderData.subFoldersRefs && folderData.subFoldersRefs.length > 0) {
    for (const subFolderRef of folderData.subFoldersRefs) {
      if (await folderHasAnyNotes(subFolderRef)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Funkcja rekurencyjna usuwająca folder wraz z wszystkimi podfolderami.
 * Zakładamy, że folder nie zawiera notatek, więc usuwamy tylko strukturę folderów.
 * @param folderRef - odniesienie do dokumentu folderu.
 */
async function recursiveDeleteFolder(
  folderRef: DocumentReference
): Promise<void> {
  const folderSnap = await getDoc(folderRef);
  if (!folderSnap.exists()) return;

  const folderData = folderSnap.data() as FolderType;
  console.log("Usuwam folder:", folderData.name);

  // Usuwanie notatek (choć w teorii powinny być puste)
  if (folderData.notesRefs && Array.isArray(folderData.notesRefs)) {
    for (const noteRef of folderData.notesRefs) {
      await deleteDoc(noteRef);
      console.log("  Usunięto notatkę:", noteRef.id);
    }
  }

  // Rekurencyjnie usuwamy wszystkie podfoldery
  if (folderData.subFoldersRefs && Array.isArray(folderData.subFoldersRefs)) {
    for (const subFolderRef of folderData.subFoldersRefs) {
      await recursiveDeleteFolder(subFolderRef);
    }
  }

  // Usuwamy sam folder
  await deleteDoc(folderRef);
  console.log("  Folder usunięty:", folderRef.id);
}

/**
 * Główna funkcja: przeszukuje foldery w danej kategorii i usuwa te, które (wraz z podfolderami) nie zawierają żadnych notatek.
 */
async function deleteEmptyFolders() {
  // Pobieramy foldery z określoną kategorią, np. "Programowanie".
  const q = query(
    collection(db, "folders"),
    where("category", "==", "Programowanie")
  );

  const foldersSnapshot = await getDocs(q);

  // Iterujemy po każdym folderze
  for (const folderDoc of foldersSnapshot.docs) {
    const folderRef = doc(db, "folders", folderDoc.id);

    // Sprawdzamy, czy folder lub jego podfoldery mają notatki.
    const hasNotes = await folderHasAnyNotes(folderRef);

    if (!hasNotes) {
      console.log(
        `Folder "${
          folderDoc.data().name
        }" oraz jego podfoldery nie zawierają notatek. Usuwam...`
      );
      await recursiveDeleteFolder(folderRef);
    } else {
      console.log(
        `Folder "${folderDoc.data().name}" zawiera notatki. Nie usuwam.`
      );
    }
  }
}

deleteEmptyFolders()
  .then(() => {
    console.log("Operacja zakończona pomyślnie.");
  })
  .catch((err) => {
    console.error("Błąd podczas operacji:", err);
  });
