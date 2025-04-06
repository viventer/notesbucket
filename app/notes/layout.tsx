import HeaderNav from "@/components/HeaderNav";
import { getAllFolders } from "@/lib/folders";
import { getNotesMetadata } from "@/lib/notes";
import { NotesMetadataProvider } from "@/context/NotesMetadataContext";
import { checkIfAuthorized } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootFolders = await getAllFolders();
  const notesMetadata = await getNotesMetadata();
  const isAdmin = await checkIfAuthorized(["admin"]);

  return (
    <NotesMetadataProvider notesMetadata={notesMetadata}>
      <div>
        <HeaderNav rootFolders={rootFolders} isAdmin={isAdmin} />
        <main className="mt-[6rem] w-[90%] max-w-[1400px] mx-auto sm:mt-[8rem]">
          {children}
        </main>
      </div>
    </NotesMetadataProvider>
  );
}
