import { FileNode } from "./buildFileTree";
import {
  collection,
  doc,
  setDoc,
  DocumentReference,
  getFirestore,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FolderSchema, NoteSchema } from "./dbSchemas";
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
 * Funkcja rekurencyjna seedująca foldery i pliki.
 *
 * @param node - bieżący węzeł (folder lub plik)
 * @param parentFolderRef - referencja do folderu nadrzędnego (null jeśli top-level)
 * @param subject - subject przekazany z folderu najwyższego rzędu
 * @returns referencja do utworzonego dokumentu lub null, jeśli pominięto
 */
export async function seedNode(
  node: FileNode,
  parentFolderRef: DocumentReference | null
): Promise<DocumentReference | null> {
  if (node.type === "folder") {
    // Jeśli to top-level folder (parentFolderRef === null) i nie przekazano subject,
    // oznacza to, że nazwa folderu nie znajduje się w mapowaniu – pomijamy go.
    const folderId = uuidv4();
    const folderDocRef = doc(collection(db, "folders"), folderId);

    if (node.name.startsWith(".") || node.name === "node_modules") {
      return null;
    }

    const folderData = {
      id: folderId,
      name: node.name,
      parentFolderRef,
      subFoldersRefs: [] as DocumentReference[],
      notesRefs: [] as DocumentReference[],
      category: "Programowanie", // lub inna logika kategoryzacji
      subject: "",
    };

    try {
      const validFolderData = FolderSchema.parse(folderData);
      await setDoc(folderDocRef, validFolderData);
    } catch (err) {
      console.error(err);
    }

    const subFoldersRefs: DocumentReference[] = [];
    const notesRefs: DocumentReference[] = [];

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const childRef = await seedNode(child, folderDocRef);
        if (childRef) {
          if (child.type === "folder") {
            subFoldersRefs.push(childRef);
          } else if (child.type === "file") {
            notesRefs.push(childRef);
          }
        }
      }
    }

    // Aktualizacja dokumentu folderu o referencje dzieci.
    await setDoc(folderDocRef, { subFoldersRefs, notesRefs }, { merge: true });
    return folderDocRef;
  } else if (node.type === "file") {
    const noteId = uuidv4();
    const noteDocRef = doc(collection(db, "notes"), noteId);

    if (!hasValidExtension(node.name) || node.name.includes("README")) {
      return null;
    }

    const title = node.name.replace(/\.(txt|md)$/, "");

    // Odczyt zawartości pliku
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(node.fullPath, "utf8");
    } catch (error) {
      console.error(`Błąd odczytu pliku ${node.fullPath}:`, error);
    }

    const noteData = {
      id: noteId,
      title,
      mdContent: fileContent,
      parentFolderRef,
    };

    try {
      const validNoteData = NoteSchema.parse(noteData);
      await setDoc(noteDocRef, validNoteData);
    } catch (err) {
      console.log(`Przekrocza ilość znaków w notatce: ${title}`);
    }
    return noteDocRef;
  }
  return null;
}

function hasValidExtension(fileName: string) {
  const validExtensions = [".txt", ".md"];
  return validExtensions.some((extension) => fileName.endsWith(extension));
}
