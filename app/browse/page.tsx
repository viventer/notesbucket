"use client";

import CategorySelector from "@/components/CategorySelector";
import Logo from "@/icons/Logo";
import { useState } from "react";

export default function page() {
  const [selectedCategory, setSelectedCategory] = useState("school");

  return (
    <div className="flex">
      <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-2">
        <section className="flex items-center gap-2">
          <Logo className="size-[2rem] text-secondary" />
          <h1 className="text-[1.75rem]">NotesBucket</h1>
        </section>
        <section>
          <CategorySelector setSelectedCategory={setSelectedCategory} />
        </section>
      </nav>
      <main></main>
    </div>
  );
}
