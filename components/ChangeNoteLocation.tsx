import LocationIcon from "@/icons/LocationIcon";
import { Button } from "./ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
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
        <Button variant="link">
          <LocationIcon className="size-4" />
        </Button>
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
