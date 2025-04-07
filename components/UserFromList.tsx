"use client";

import CancelIcon from "@/icons/CancelIcon";
import VerifiedIcon from "@/icons/VerifiedIcon";
import { UserType } from "@/lib/dbSchemas";
import { ChevronDown } from "lucide-react";

type UserWithoutCategories = Omit<UserType, "createdAt">;

export default function UserFromList({
  userData,
}: {
  userData: UserWithoutCategories;
}) {
  return (
    <li className="flex items-center gap-2">
      <button>
        {userData.role === "unverified" ? (
          <CancelIcon className="size-8" />
        ) : (
          <VerifiedIcon className="size-8" />
        )}
      </button>
      <p>
        {userData.firstName} {userData.lastName}
      </p>
      <button>
        <ChevronDown />
      </button>
    </li>
  );
}
