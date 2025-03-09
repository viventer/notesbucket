"use client";

import { FormField, FormItem } from "./ui/form";
import Folder from "./Folder";
import { useFormContext } from "react-hook-form";

export default function NoteSelector({ folders }: { folders: FolderData[] }) {
  const form = useFormContext();

  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");

  return (
    <FormField
      control={form.control}
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
