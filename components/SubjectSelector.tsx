"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

export default function SubjectSelector() {
  const subjects = [
    "ABD",
    "Fizyka",
    "Geografia",
    "Historia",
    "J. angielski",
    "J. polski",
    "Matematyka",
    "PBD",
    "PSI",
    "PAI",
    "WOS",
  ];

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem className="max-w-[250px]">
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue="J. polski"
          >
            <FormControl>
              <SelectTrigger className="text-base border-primary">
                <SelectValue
                  placeholder="Wybierz przedmiot"
                  className="text-base z-50"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-card border-primary">
              {subjects.map((subject) => (
                <SelectItem
                  key={subject}
                  value={subject}
                  className="text-base z-50 focus:bg-secondary focus:text-background dark:focus:text-text hover:cursor-pointer"
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
