"use client";

import { FormProvider, useForm } from "react-hook-form";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm({
    defaultValues: {
      category: "Szkoła",
      subject: "J. polski",
      note: "",
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
