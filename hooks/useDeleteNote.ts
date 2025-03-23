import { deleteNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { useConfirmDialog } from "@/components/ConfirmDialogProvider";
import { useToast } from "@/hooks/useToast";

export const useDeleteNote = () => {
  const router = useRouter();
  const { showDialog } = useConfirmDialog();
  const { showToast } = useToast();

  const deleteNoteHandler = (noteId: string) => {
    showDialog({
      message: "Czy na pewno chcesz usunąć notatkę?",
      description: "Ta operacja jest nieodwracalna.",
      onConfirm: async () => {
        try {
          await deleteNote(noteId);
          router.push("/notes/edit");
          setTimeout(() => {
            window.location.reload();
          }, 500);
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
