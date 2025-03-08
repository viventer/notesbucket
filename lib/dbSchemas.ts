import { z } from "zod";
import { DocumentReference } from "@firebase/firestore-types";

export const FolderSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Nazwa folderu nie może być pusta")
    .max(48, "Nazwa folderu nie może przekraczać 48 znaków"),
  parentFolderRef: z.custom<DocumentReference | null>(),
  subFoldersRefs: z.array(z.custom<DocumentReference>()).default([]),
  notesRefs: z.array(z.custom<DocumentReference>()).default([]),
  category: z.custom<Category>(),
  subject: z.custom<Subject | null>(),
});

export const NoteSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Nazwa notatki nie może być pusta")
    .max(48, "Nazwa notatki nie może przekraczać 48 znaków"),
  mdContent: z
    .string()
    .max(10000, "Ilość znaków w notatce nie może przekraczać 10000 znaków"),
  parentFolderRef: z.custom<DocumentReference | null>(),
});
