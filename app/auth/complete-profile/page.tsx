import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NameForm from "@/components/NameForm";

export default function page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jak się nazywasz?</CardTitle>
        <CardDescription>Prawdziwe dane ułatwią weryfikację.</CardDescription>
      </CardHeader>
      <CardContent>
        <NameForm />
      </CardContent>
    </Card>
  );
}
