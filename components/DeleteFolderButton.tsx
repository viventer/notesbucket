import { useToast } from "@/hooks/useToast";
import DeleteIcon from "@/icons/DeleteIcon";
import { useConfirmDialog } from "./ConfirmDialogProvider";
import { deleteFolder } from "@/lib/folders";

export default function DeleteFolderButton({ folderId }: { folderId: string }) {
  const { showToast } = useToast();
  const { showDialog } = useConfirmDialog();

  const handleDeleteFolder = () => {
    showDialog({
      message: "Czy na pewno chcesz usunąć folder?",
      description:
        "Wraz z folderem zniknie cała jego zawartość. Ta operacja jest nieodwracalna.",
      confirmText: "Tak",
      cancelText: "Nie",
      onConfirm: async () => {
        try {
          await deleteFolder(folderId);
          showToast("Folder został usunięty.", "success");
        } catch (err) {
          showToast(`Błąd usuwania folderu: ${err}`, "error");
        }
      },
    });
  };

  return (
    <button onClick={handleDeleteFolder} className="hover:text-destructive">
      <DeleteIcon className="size-4" />
    </button>
  );
}
