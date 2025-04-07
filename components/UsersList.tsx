import { UserType } from "@/lib/dbSchemas";
import UserFromList from "./UserFromList";

export default function UsersList({ usersData }: { usersData: UserType[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {usersData.map((user) => {
        const { createdAt, ...userData } = user;
        return <UserFromList userData={userData} key={user.id} />;
      })}
    </ul>
  );
}
