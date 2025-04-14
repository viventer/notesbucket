import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorIcon from "@/icons/ErrorIcon";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="flex flex-col gap-2 justify-center max-w-[500px] mx-auto border-destructive bg-background w-[90%]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ErrorIcon className="size-[3rem] text-destructive" />
            <h2 className="text-[2rem] font-[500]">Brak dostępu</h2>
          </CardTitle>
          <CardDescription>
            Nie masz uprawnień do rządanego zasobu. Jeśli uważasz, że to błąd -
            skontaktuj się z administratorem.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full  flex justify-end">
          <Button variant={"link"} asChild className="opacity-100">
            <Link href={"/"}>Wróć na stronę główną</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
