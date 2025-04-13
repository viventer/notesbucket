import { FileNode } from "./buildFileTree";
import {
  collection,
  doc,
  setDoc,
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

async function deleteTrash() {
  const q = query(
    collection(db, "folders"),
    where("category", "==", "Programowanie")
  );

  const folders = await getDocs(q);

  folders.docs.forEach((document) => {
    const documentData = document.data() as FolderType;
    console.log(documentData.name);
    const notesRefs = documentData.notesRefs;
    notesRefs.forEach((noteRef) => {
      deleteDoc(noteRef);
    });

    const docToDelete = doc(db, "folders", document.id);
    deleteDoc(docToDelete);
  });
}

deleteTrash()
  .then(() => {
    console.log("Seedowanie zakończone pomyślnie.");
  })
  .catch((err) => {
    console.error("Błąd podczas seedowania:", err);
  });
