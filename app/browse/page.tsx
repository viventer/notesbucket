"use client";

import CategorySelector from "@/components/CategorySelector";
import NoteSelector from "@/components/NoteSelector";
import SubjectSelector from "@/components/SubjectSelector";
import Logo from "@/icons/Logo";
import { seed } from "@/lib/seed";
import { useEffect } from "react";
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

  return (
    <div className="flex">
      <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-2">
        <section className="flex items-center gap-2">
          <Logo className="size-[2rem] text-secondary" />
          <h1 className="text-[1.75rem]">NotesBucket</h1>
        </section>
        <FormProvider {...form}>
          <CategorySelector form={form} />
          {selectedCategory === "Szkoła" && <SubjectSelector form={form} />}
          <NoteSelector form={form} />
        </FormProvider>
      </nav>
      <main></main>
    </div>
  );
}
