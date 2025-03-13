type NavForm = UseFormReturn<NavFormValues>;

type NavFormValues = {
  category: Category;
  subject: Subject;
  noteTitle: NoteType["title"];
};

type Category = "Programowanie" | "Szkoła" | "Inne";

type Subject =
  | "Matematyka"
  | "J. angielski"
  | "Fizyka"
  | "J. polski"
  | "PBD"
  | "PSI"
  | "PAI"
  | "ABD"
  | "Historia"
  | "WOS"
  | "Geografia";
