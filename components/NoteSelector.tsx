import Folder from "./Folder";

export default function NoteSelector({ folders }: { folders: FolderData[] }) {
  const foldersElements = folders.map((folder) => (
    <Folder key={folder.id} folder={folder} />
  ));

  return foldersElements;
}
