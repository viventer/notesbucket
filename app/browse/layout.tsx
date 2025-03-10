import HeaderNav from "@/components/HeaderNav";
import { fetchFolders } from "@/lib/fetchFolders";
import FormLayout from "@/components/FormLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootFolders = await fetchFolders();

  return (
    <div>
      <FormLayout>
        <HeaderNav rootFolders={JSON.parse(JSON.stringify(rootFolders))} />
        <main className="mt-4 w-[90%] max-w-[1400px] mx-auto">{children}</main>
      </FormLayout>
    </div>
  );
}
