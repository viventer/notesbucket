import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NameForm from "@/components/NameForm";
import { checkIfNewUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const isNewUser = await checkIfNewUser();
  if (!isNewUser) {
    redirect("/");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="tex-text">Jak się nazywasz?</CardTitle>
        <CardDescription>Prawdziwe dane ułatwią weryfikację.</CardDescription>
      </CardHeader>
      <CardContent>
        <NameForm />
      </CardContent>
    </Card>
  );
}
