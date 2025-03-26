import { z } from "zod";
import { DocumentReference } from "firebase/firestore";

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

export const NoteImageSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Nazwa obrazu musi zawierać min. 3 znaki")
    .max(24, "Nazwa obrazu może zawierać max. 24 znaki"),
  url: z.string().url("Niepoprawny url obrazu"),
  storageFileName: z.string(),
  noteRef: z.custom<DocumentReference>(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email("Niepoprawny adres email"),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["unverified", "admin", "verified"]),
  availableCategories: z.array(z.string()).default([]),
  createdAt: z.date(),
});

export type NoteType = z.infer<typeof NoteSchema>;

export type FolderType = z.infer<typeof FolderSchema> & {
  children?: FolderType[];
};

export type NoteImageType = z.infer<typeof NoteImageSchema>;

export type UserType = z.infer<typeof UserSchema>;

export type UserRole = UserType["role"];

export type AvailableCategory = UserType["availableCategories"][number];
