import React from "react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubjectSelector({ form }: { form: NavForm }) {
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

  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue="J. polski"
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder="Wybierz przedmiot"
                  className="text-base"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject} className="text-base">
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
