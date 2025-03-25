import LocationIcon from "@/icons/LocationIcon";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import FoldersList from "./FoldersList";

export default function ChangeNoteLocation({
  noteTitle,
}: {
  noteTitle: string;
}) {
  const handleMoveNote = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" hover:text-accent">
          <LocationIcon className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteTitle}</DialogTitle>
          <DialogDescription>Przenieś notatkę</DialogDescription>
        </DialogHeader>
        <FoldersList />
        <DialogFooter>
          <Button type="submit" onClick={handleMoveNote}>
            Zapisz zmiany
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
