import { z } from "zod";
import { DocumentReference } from "@firebase/firestore-types";

export const FolderSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Nazwa folderu musi zawierać min. 3 znaki")
    .max(24, "Nazwa folderu nie może przekraczać 24 znaków"),
  parentFolderRef: z.custom<DocumentReference | null>(),
  subFoldersRefs: z.array(z.custom<DocumentReference | null>()),
  notesRefs: z.array(z.custom<DocumentReference | null>()),
});

export const NoteSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, "Nazwa notatki musi zawierać min. 3 znaki")
    .max(24, "Nazwa notatki nie może przekraczać 24 znaków"),
  mdContent: z
    .string()
    .max(10000, "Ilość znaków w notatce nie może przekraczać 10000 znaków"),
  category: z.custom<Category>(),
  subject: z.custom<Subject | null>(),
  parentFolderRef: z.custom<DocumentReference | null>(),
});
