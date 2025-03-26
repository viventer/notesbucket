import LogoutButton from "@/components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Twoje konto jest weryfikowane</CardTitle>
        <CardDescription>
          Aby przyśpieszyć i ułatwić weryfikację - napisz do mnie na
          messengerze.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full  flex justify-end">
        <LogoutButton />
      </CardContent>
    </Card>
  );
}
