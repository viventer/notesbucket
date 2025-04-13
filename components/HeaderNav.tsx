"use client";

import Chevron from "@/icons/Chevron";
import Logo from "@/icons/Logo";
import React, { useEffect, useState } from "react";
import CategorySelector from "./CategorySelector";
import SubjectSelector from "./SubjectSelector";
import NoteSelector from "./NoteSelector";
import { FormProvider, useForm } from "react-hook-form";
import { SerializedFolderType } from "@/lib/dbSchemas";
import { AdminNav } from "./AdminNav";
import LogoutButton from "./LogoutButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import VerifiedUserIcon from "@/icons/VerifiedUserIcon";
import { usePathname } from "next/navigation";
import { useUser } from "./UserContext";

export default function HeaderNav({
  rootFolders,
}: {
  rootFolders: SerializedFolderType[];
}) {
  const form = useForm({
    defaultValues: {
      category: "Szkoła",
      subject: "J. polski",
    },
  });

  const pathname = usePathname();
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [user] = useAuthState(auth);
  const { role } = useUser();
  const isAdmin = role === "admin";

  const selectedCategory = form.watch("category");

  return (
    <div
      className={`bg-card  h-fit w-full sm:w-fit sm:m-4 md:m-8 border-solid border-primary border-0 border-b-[0.1rem] fixed left-0 top-0 z-10 max-h-[95svh] overflow-auto scrollbar-thin`}
    >
      <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-3 max-w-[500px] sm:mx-3 relative ">
        <section>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Logo className="size-[2rem] text-secondary" />
              <h1 className="text-[1.5rem]">NotesBucket</h1>
            </div>
            <Chevron
              className={`size-8 text-text ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </section>
        <div className={`${isExpanded ? "" : "hidden"} `}>
          <section
            className={`flex flex-col gap-4 max-h-[60svh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary `}
          >
            {isAdmin && <AdminNav />}
            <FormProvider {...form}>
              <CategorySelector />
              {selectedCategory == "Szkoła" && <SubjectSelector />}
              <NoteSelector folders={rootFolders} />
            </FormProvider>
          </section>
          <section className="mt-6 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <VerifiedUserIcon className="size-8 text-primary" />
              <p className="hidden sm:inline">
                {user?.email || user?.displayName || ""}
              </p>
            </div>
            <LogoutButton />
          </section>
        </div>
      </nav>
    </div>
  );
}
