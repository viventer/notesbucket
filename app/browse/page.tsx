"use client";

import CategorySelector from "@/components/CategorySelector";
import NoteSelector from "@/components/NoteSelector";
import SubjectSelector from "@/components/SubjectSelector";
import Chevron from "@/icons/Chevron";
import Logo from "@/icons/Logo";
import { seed } from "@/lib/seed";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function page() {
  const form: NavForm = useForm({
    defaultValues: {
      category: "Szkoła",
      subject: "J. polski",
      note: "",
    },
  });
  const selectedCategory = form.watch("category");
  const selectedSubject = form.watch("subject");
  const selectedNote = form.watch("note");
  useEffect(() => {
    console.log(selectedCategory);
    console.log(selectedSubject);
    console.log(selectedNote);
  }, [selectedCategory, selectedSubject, selectedNote]);

  const [isExpanded, setIsExpanded] = useState(false);
  const rotationClass = `rotate-${isExpanded ? "0" : "180"}`;

  return (
    <div className="flex">
      <div
        className={`bg-[rgba(255,255,255,0.05)]  h-fit w-full sm:w-fit sm:m-4  md:rounded-lg md:m-8 border-solid border-primary border-0 border-b-[0.1rem] md:border-[0.1rem]`}
      >
        <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-3 max-w-[400px] sm:mx-3 relative">
          <section className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <Logo className="size-[2rem] text-secondary" />
              <h1 className="text-[1.5rem]">NotesBucket</h1>
            </div>
            <button onClick={() => setIsExpanded((prev) => !prev)}>
              <Chevron className={`size-8 text-text ${rotationClass}`} />
            </button>
          </section>
          <FormProvider {...form}>
            <section
              className={`${
                isExpanded ? "" : "hidden"
              } flex flex-col gap-4 max-h-[75svh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary `}
            >
              <CategorySelector form={form} />
              {selectedCategory === "Szkoła" && <SubjectSelector form={form} />}
              <NoteSelector form={form} />
            </section>
          </FormProvider>
        </nav>
      </div>
      <main></main>
    </div>
  );
}
