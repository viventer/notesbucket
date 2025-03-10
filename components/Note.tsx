"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function Note({ mode }: { mode: "view" | "edit" }) {
  const { watch } = useFormContext();

  const selectedNote = watch("note");
  useEffect(() => {
    console.log(selectedNote);
  }, [selectedNote]);

  return <div>Note</div>;
}
