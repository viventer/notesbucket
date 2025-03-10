"use client";

import { FormField, FormItem } from "./ui/form";
import Folder from "./Folder";

export default function NoteSelector({ folders }: { folders: FolderData[] }) {
  return (
    <FormField
      name="note"
      render={({ field }) => (
        <FormItem>
          {folders.map((folder) => (
            <Folder key={folder.id} folder={folder} />
          ))}
        </FormItem>
      )}
    />
  );
}
