import { collection, doc, setDoc, DocumentReference } from "firebase/firestore";
import { db } from "./firebase"; // importuj skonfigurowany Firestore
import { v4 as uuidv4 } from "uuid";
import { FolderSchema, NoteSchema } from "./dbSchemas"; // zaimportuj swoje schematy Zod

// Typ węzła drzewa – folder lub plik
interface FileNode {
  name: string;
  type: "folder" | "file";
  // Dla folderu: dzieci (mogą być folderami lub plikami)
  children?: FileNode[];
}

// Reprezentacja hierarchii (pomijamy folder "polski" – jego nazwa zastępuje subject)
const tree: FileNode[] = [
  {
    name: "dziady v3",
    type: "folder",
    children: [
      { name: "cechy gatunkowe", type: "file" },
      { name: "do przyjaciół", type: "file" },
      { name: "geneza", type: "file" },
      { name: "poematy opisowe", type: "file" },
      { name: "scena I", type: "file" },
      { name: "scena II, III, IV", type: "file" },
      { name: "scena V", type: "file" },
      { name: "scena VI sen senatora", type: "file" },
      { name: "scena VII", type: "file" },
      { name: "scena viii", type: "file" },
    ],
  },
  {
    name: "kordian",
    type: "folder",
    children: [
      { name: "1-geneza", type: "file" },
      { name: "2-interpretacja przyg", type: "file" },
      { name: "3-prolog", type: "file" },
      { name: "4-kim jest kordian", type: "file" },
      { name: "5-dojrzewanie wew", type: "file" },
      { name: "6-analiza porównawcza", type: "file" },
      { name: "7-obraz spisku", type: "file" },
      { name: "8-polemika i przyczyny kleski", type: "file" },
      { name: "akt2", type: "file" },
      { name: "akt3", type: "file" },
    ],
  },
  {
    name: "lalka",
    type: "folder",
    children: [
      { name: "losy-rzeckiego-powtorka", type: "file" },
      { name: "losy-rzeckiego", type: "file" },
      { name: "losy-wokulskiego", type: "file" },
      { name: "pytania", type: "file" },
      {
        name: "streszczenie",
        type: "folder",
        children: [
          { name: "1.1", type: "file" },
          { name: "1.10", type: "file" },
          // … pozostałe pliki w folderze streszczenie
        ],
      },
    ],
  },
  {
    name: "potop",
    type: "folder",
    children: [{ name: "wypracowanie", type: "file" }],
  },
  {
    name: "romantyzm",
    type: "folder",
    children: [
      { name: "Oda do młodości", type: "file" },
      { name: "Wstępna charakterystyka romantyzmu", type: "file" },
      { name: "ajudah", type: "file" },
      { name: "bakczysaraj", type: "file" },
      { name: "ballada romantyczność", type: "file" },
      { name: "burza", type: "file" },
      { name: "cz.4 dziadów", type: "file" },
      { name: "czatyrdach", type: "file" },
      { name: "lilie", type: "file" },
      { name: "romantyczna biografia", type: "file" },
      { name: "stepy akermańskie", type: "file" },
      { name: "świtezianka", type: "file" },
      { name: "świteź", type: "file" },
    ],
  },
  {
    name: "romantyzm v2",
    type: "folder",
    children: [
      { name: "cechy dramatu roman", type: "file" },
      { name: "cechy hrabiego", type: "file" },
      { name: "fortepian", type: "file" },
      { name: "geneza nie boskiej", type: "file" },
      { name: "grób agammemnona", type: "file" },
      { name: "hymn do boga", type: "file" },
      { name: "obraz rewolucji", type: "file" },
      { name: "obraz życia rodzinnego męża", type: "file" },
      { name: "portret hrabiego", type: "file" },
      { name: "testament moj", type: "file" },
      { name: "w weronie", type: "file" },
      { name: "wstęp do cz1", type: "file" },
    ],
  },
  {
    name: "wallenrod",
    type: "folder",
    children: [
      { name: "1-geneza i przesłanie", type: "file" },
      { name: "2-moralne koszty spiskowania ", type: "file" },
      { name: "3-rola wieści gminnej", type: "file" },
      { name: "4-konrad jako powieść poeatyczna", type: "file" },
      { name: "5-analiza podręcznikowych", type: "file" },
    ],
  },
  {
    name: "wesele",
    type: "folder",
    children: [
      {
        name: "notatki",
        type: "folder",
        children: [{ name: "wesele-a-teatr-antyczne", type: "file" }],
      },
      {
        name: "pytaniamat",
        type: "folder",
        children: [{ name: "ogólnie", type: "file" }],
      },
      {
        name: "sprawdzian",
        type: "folder",
        children: [{ name: "pytanie", type: "file" }],
      },
    ],
  },
  {
    name: "zik",
    type: "folder",
    children: [
      {
        name: "pytania-maturalne",
        type: "folder",
        children: [
          { name: "37", type: "file" },
          { name: "38", type: "file" },
          { name: "39", type: "file" },
          { name: "40", type: "file" },
          { name: "41", type: "file" },
        ],
      },
    ],
  },
];

/**
 * Funkcja rekurencyjna tworząca dokumenty folderów i notatek.
 * @param node - bieżący węzeł drzewa (folder lub plik)
 * @param parentFolderRef - referencja do folderu nadrzędnego (null, jeśli węzeł jest na najwyższym poziomie)
 * @returns referencja do utworzonego dokumentu (folderu lub notatki)
 */
async function seedNode(
  node: FileNode,
  parentFolderRef: DocumentReference | null
): Promise<DocumentReference | null> {
  if (node.type === "folder") {
    // Generujemy identyfikator dla folderu
    const folderId = uuidv4();
    const folderDocRef = doc(collection(db, "folders"), folderId);

    // Przygotowujemy dane folderu
    const folderData = {
      id: folderId,
      name: node.name,
      parentFolderRef,
      subFoldersRefs: [] as DocumentReference[],
      notesRefs: [] as DocumentReference[],
    };

    // Walidacja danych folderu przy użyciu Zod
    const validFolderData = FolderSchema.parse(folderData);

    // Zapis dokumentu folderu
    await setDoc(folderDocRef, validFolderData);

    // Tablice do zbierania referencji dzieci
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

    // Aktualizujemy folder, aby zapisać referencje do subfolderów i notatek
    await setDoc(folderDocRef, { subFoldersRefs, notesRefs }, { merge: true });
    return folderDocRef;
  } else if (node.type === "file") {
    // Generujemy identyfikator dla notatki
    const noteId = uuidv4();
    const noteDocRef = doc(collection(db, "notes"), noteId);
    // Wyodrębniamy tytuł – usuwamy rozszerzenie  lube
    const title = node.name.replace(/\.(txt|md)$/, "");

    // Przygotowujemy dane notatki
    const noteData = {
      id: noteId,
      title,
      mdContent: "", // pusta treść
      category: "Szkoła", // kategoria dla wszystkich notatek
      subject: "J. polski", // przedmiot ustawiony na polski
      parentFolderRef,
    };

    // Walidacja danych notatki przy użyciu Zod
    const validNoteData = NoteSchema.parse(noteData);

    // Zapis dokumentu notatki
    await setDoc(noteDocRef, validNoteData);
    return noteDocRef;
  }
  return null;
}

/**
 * Funkcja seed, która rozpoczyna tworzenie dokumentów na podstawie zdefiniowanej hierarchii.
 */
export async function seed() {
  // Iterujemy po węzłach najwyższego poziomu (dzieci folderu "polski")
  for (const node of tree) {
    await seedNode(node, null);
  }
}
