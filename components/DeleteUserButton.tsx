"use client";

import { useToast } from "@/hooks/useToast";
import MinusSquare from "@/icons/MinusSquare";
import { deleteUser } from "@/lib/users";
import { useConfirmDialog } from "./ConfirmDialogProvider";

export default function DeleteUserButton({ userId }: { userId: string }) {
  const { showToast } = useToast();
  const { showDialog } = useConfirmDialog();

  const handleDeleteUser = async () => {
    showDialog({
      message: "Czy na pewno chcesz usunąć użytkownika?",
      description: "Ta operacja jest nieodwracalna.",
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          showToast("Użytkownik został usunięty.", "success");
        } catch (err) {
          showToast(`Błąd usuwania użytkownika: ${err}`, "error");
        }
      },
    });
  };

  return (
    <button
      className="text-primary hover:text-destructive"
      onClick={handleDeleteUser}
    >
      <MinusSquare className={`size-4`} />
    </button>
  );
}
