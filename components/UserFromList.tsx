"use client";

import { UserType } from "@/lib/dbSchemas";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ChangeRoleButton from "./ChangeRoleButton";

type UserWithoutCategories = Omit<UserType, "createdAt">;

export default function UserFromList({
  userData,
}: {
  userData: UserWithoutCategories;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="flex flex-col gap-2">
      <section className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-2">
          <ChangeRoleButton oldRole={userData.role} userId={userData.id} />
          <p className="text-text">
            {userData.firstName} {userData.lastName}
          </p>
        </div>
        <button onClick={() => setIsExpanded((prev) => !prev)}>
          <ChevronDown
            className={`text-text ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </section>
      {isExpanded && (
        <section className="bg-black/15 px-3 py-2 rounded-lg text-text">
          <p>
            <b>Rola:</b> {userData.role}
          </p>
          {userData.email && (
            <p>
              <b>Email:</b> {userData.email}
            </p>
          )}
        </section>
      )}
    </li>
  );
}
