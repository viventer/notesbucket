import {
  FolderType,
  NoteImageType,
  SerializedFolderType,
  SerializedNoteImageType,
} from "./dbSchemas";

export function serializeFolder(folder: FolderType): SerializedFolderType {
  const notesIds: string[] = folder.notesRefs.map((noteRef) => noteRef.id);
  const subFoldersIds: string[] = folder.subFoldersRefs.map(
    (subFolderRef) => subFolderRef.id
  );
  const parentFolderId: string = folder.parentFolderRef?.id || "";

  return {
    id: folder.id,
    name: folder.name,
    category: folder.category,
    subject: folder.subject,
    notesIds,
    subFoldersIds,
    parentFolderId,
  };
}
