"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

export default function CategorySelector() {
  const form = useFormContext();

  return (
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
              defaultValue="Szkoła"
            >
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <RadioGroupItem value="Szkoła"></RadioGroupItem>
                </FormControl>
                <FormLabel className="!mt-0 text-base font-normal ">
                  Szkoła
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center gap-2 ">
                <FormControl>
                  <RadioGroupItem value="Programowanie"></RadioGroupItem>
                </FormControl>
                <FormLabel className="!mt-0 text-base font-normal">
                  Programowanie
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
