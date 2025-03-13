"use client";

import Chevron from "@/icons/Chevron";
import Logo from "@/icons/Logo";
import React, { useState } from "react";
import CategorySelector from "./CategorySelector";
import SubjectSelector from "./SubjectSelector";
import NoteSelector from "./NoteSelector";
import { FormProvider, useForm } from "react-hook-form";
import { FolderType } from "@/lib/dbSchemas";

export default function HeaderNav({
  rootFolders,
}: {
  rootFolders: FolderType[];
}) {
  const form = useForm({
    defaultValues: {
      category: "Szkoła",
      subject: "J. polski",
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const rotationClass = `rotate-${isExpanded ? "0" : "180"}`;

  const selectedCategory = form.watch("category");

  return (
    <div
      className={`bg-background  h-fit w-full sm:w-fit sm:m-4  md:rounded-lg md:m-8 border-solid border-primary border-0 border-b-[0.1rem] md:border-[0.1rem] fixed left-0 top-0`}
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
            <Chevron className={`size-8 text-text ${rotationClass}`} />
          </button>
        </section>
        <section
          className={`${
            isExpanded ? "" : "hidden"
          } flex flex-col gap-4 max-h-[75svh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary `}
        >
          <FormProvider {...form}>
            <CategorySelector />
            {selectedCategory == "Szkoła" && <SubjectSelector />}
            <NoteSelector folders={JSON.parse(JSON.stringify(rootFolders))} />
          </FormProvider>
        </section>
      </nav>
    </div>
  );
}
