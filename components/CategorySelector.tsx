"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CategorySelector({
  setSelectedCategory,
}: {
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm({
    defaultValues: {
      category: "school",
    },
  });
  const selectedCategory = form.watch("category");
  useEffect(() => {
    setSelectedCategory(selectedCategory as string);
  }, [selectedCategory]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Wybierz kategorie</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                defaultValue="school"
              >
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value="school"></RadioGroupItem>
                  </FormControl>
                  <FormLabel className="!mt-0 text-base font-normal">
                    Szkoła
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value="programming"></RadioGroupItem>
                  </FormControl>
                  <FormLabel className="!mt-0 text-base font-normal">
                    Programowanie
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <RadioGroupItem value="other"></RadioGroupItem>
                  </FormControl>
                  <FormLabel className="!mt-0 text-base font-normal">
                    Inne
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
