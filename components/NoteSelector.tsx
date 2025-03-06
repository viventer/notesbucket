import { FormField, FormItem } from "./ui/form";

export default function NoteSelector({ form }: { form: NavForm }) {
  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => <FormItem></FormItem>}
    />
  );
}
