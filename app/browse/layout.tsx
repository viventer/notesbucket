"use client";

import { FormProvider, useForm } from "react-hook-form";

export default function Layout({ children }: { children: React.ReactNode }) {
  const form: NavForm = useForm({
    defaultValues: {
      category: "Szkoła",
      subject: "J. polski",
      note: "",
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
