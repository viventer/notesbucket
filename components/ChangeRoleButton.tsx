"use client";

import { useToast } from "@/hooks/useToast";
import AdminIcon from "@/icons/AdminIcon";
import CancelIcon from "@/icons/CancelIcon";
import VerifiedIcon from "@/icons/VerifiedIcon";
import { UserRole } from "@/lib/dbSchemas";
import { setUserRole } from "@/lib/users";

export default function ChangeRoleButton({
  userId,
  oldRole,
}: {
  userId: string;
  oldRole: UserRole;
}) {
  const { showToast } = useToast();

  const changeRoleHandler = async () => {
    if (oldRole === "admin") {
      showToast(
        "Zmiana roli admina możliwa jest tylko przez firebase console.",
        "error"
      );

      return;
    }

    const newRole = oldRole === "unverified" ? "verified" : "unverified";
    try {
      await setUserRole(userId, newRole);
      showToast("Rola użytkownika została zmieniona.", "success");
    } catch (err) {
      console.error(err);
      showToast("Błąd zmiany roli.");
    }
  };

  return (
    <button onClick={changeRoleHandler}>
      {oldRole === "admin" ? (
        <AdminIcon className="size-8 text-accent" />
      ) : oldRole === "verified" ? (
        <VerifiedIcon className="size-8 text-success" />
      ) : (
        <CancelIcon className="size-8 text-destructive" />
      )}
    </button>
  );
}
