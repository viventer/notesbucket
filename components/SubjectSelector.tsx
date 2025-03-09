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
    "Matematyka",
    "J. angielski",
    "Fizyka",
    "J. polski",
    "PBD",
    "PSI",
    "PAI",
    "ABD",
    "Historia",
    "WOS",
    "Geografia",
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
              <SelectTrigger className="text-base">
                <SelectValue
                  placeholder="Wybierz przedmiot"
                  className="text-base z-50"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background">
              {subjects.map((subject) => (
                <SelectItem
                  key={subject}
                  value={subject}
                  className="text-base z-50 "
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
