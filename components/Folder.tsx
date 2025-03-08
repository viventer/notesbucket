import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FolderSchema, NoteSchema } from "@/lib/dbSchemas";
import ClosedFolder from "@/icons/ClosedFolder";
import OpenedFolder from "@/icons/OpenedFolder";
import NoteIcon from "@/icons/NoteIcon";
import { useFormContext } from "react-hook-form";
import { truncateString } from "@/lib/utils";

interface FolderProps {
  folder: FolderData;
}

export default function Folder({ folder }: FolderProps) {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { setValue, getValues } = useFormContext();
  const truncatedFolderName = truncateString(folder.name, 24);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      const folderRef = doc(db, "folders", folder.id);

      const q = query(
        collection(db, "notes"),
        where("parentFolderRef", "==", folderRef)
      );
      const snapshot = await getDocs(q);
      const notesData: NoteType[] = snapshot.docs.map((doc) => ({
        ...NoteSchema.parse(doc.data()),
      }));
      setNotes(notesData);
      setLoading(false);
    }
    fetchNotes();
  }, []);

  return (
    <div className={`${folder.parentFolderRef ? "ml-4" : ""}`}>
      <button
        className="flex items-center gap-2 text-base"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? (
          <OpenedFolder className="size-4 text-secondary" />
        ) : (
          <ClosedFolder className="size-4 text-secondary" />
        )}
        {truncatedFolderName}
      </button>
      {isExpanded && (
        <>
          <div className="ml-4 flex flex-col gap-1 mt-1">
            {loading && <span>Ładowanie notatek...</span>}
            {notes.map((note) => (
              <button
                key={note.id}
                className={`text-sm flex items-center gap-2 ${
                  getValues("note") == note.id ? "font-semibold" : ""
                }`}
                onClick={() => setValue("note", note.id)}
              >
                <NoteIcon
                  className={`size-4 ${
                    getValues("note") == note.id
                      ? "text-accent"
                      : "text-primary"
                  }`}
                />
                {truncateString(note.title, 24)}
              </button>
            ))}
          </div>

          <div>
            {folder.children?.map((subFolder: FolderData) => (
              <Folder key={subFolder.id} folder={subFolder} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
