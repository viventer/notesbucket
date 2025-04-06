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
import { getUserPerms } from "@/lib/auth";

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (user) {
      (async function () {
        const { role } = await getUserPerms(user.uid);
        if (role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })();
    }
  }, [loading]);

  const selectedCategory = form.watch("category");

  return (
    <div
      className={`bg-card  h-fit w-full sm:w-fit sm:m-4 md:m-8 border-solid border-primary border-0 border-b-[0.1rem] fixed left-0 top-0 z-10`}
    >
      <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-3 max-w-[400px] sm:mx-3 relative">
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
        <section
          className={`${
            isExpanded ? "" : "hidden"
          } flex flex-col gap-4 max-h-[75svh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary `}
        >
          {isAdmin && <AdminNav />}
          <FormProvider {...form}>
            <CategorySelector />
            {selectedCategory == "Szkoła" && <SubjectSelector />}
            <NoteSelector folders={rootFolders} />
          </FormProvider>
          <LogoutButton />
        </section>
      </nav>
    </div>
  );
}
