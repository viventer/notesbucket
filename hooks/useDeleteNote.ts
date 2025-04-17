import { deleteNote } from "@/lib/notes";
import { usePathname, useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/ConfirmDialogProvider";
import { useToast } from "@/hooks/useToast";

export const useDeleteNote = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showDialog } = useConfirmDialog();
  const { showToast } = useToast();

  const deleteNoteHandler = (noteId: string) => {
    if (pathname !== "/notes/edit") {
      router.replace("/notes/edit");
    }
    showDialog({
      message: "Czy na pewno chcesz usunąć notatkę?",
      description: "Ta operacja jest nieodwracalna.",
      onConfirm: async () => {
        try {
          await deleteNote(noteId);
          showToast("Notatka została usunięta.", "success");
        } catch (err) {
          showToast(`Błąd usuwania notakti: ${err}`, "error");
          console.error(err);
        }
      },
    });
  };

  return { deleteNoteHandler };
};
