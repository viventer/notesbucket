import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersList from "@/components/UsersList";
import { getAllUsers } from "@/lib/users";
import Link from "next/link";

export default async function Page() {
  const usersData = await getAllUsers();

  return (
    <main className="h-screen w-screen flex items-center">
      <Card className="w-[95%] max-w-[1024px] mx-auto">
        <CardHeader>
          <CardTitle className="text-text">Zarządzanie użytkownikami</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList usersData={usersData} />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button variant="link" asChild>
              <Link
                href="/notes"
                className="transition-all  ease-in-out decoration-accent decoration-[0.1rem]"
              >
                Przeglądanie
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href="/notes/edit"
                className="transition-all  ease-in-out decoration-accent decoration-[0.1rem]"
              >
                Edycja
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
