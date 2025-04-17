import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NameForm from "@/components/NameForm";
import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserName } from "@/lib/users";

export default async function Page() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/auth");
  }
  const { firstName, lastName } = await getUserName(userId);
  if (firstName && lastName) {
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
