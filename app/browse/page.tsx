import CategorySelector from "@/components/CategorySelector";
import NoteSelector from "@/components/NoteSelector";
import SubjectSelector from "@/components/SubjectSelector";
import Chevron from "@/icons/Chevron";
import Logo from "@/icons/Logo";
import { fetchFolders } from "@/lib/fetchFolders";

export default async function page() {
  // useEffect(() => {
  //   console.log(selectedCategory);
  //   console.log(selectedSubject);
  //   console.log(selectedNote);
  // }, [selectedCategory, selectedSubject, selectedNote]);

  const rootFolders = await fetchFolders();

  const isExpanded = true;
  const rotationClass = `rotate-${isExpanded ? "0" : "180"}`;

  return (
    <div className="flex">
      <div
        className={`bg-[rgba(255,255,255,0.05)]  h-fit w-full sm:w-fit sm:m-4  md:rounded-lg md:m-8 border-solid border-primary border-0 border-b-[0.1rem] md:border-[0.1rem]`}
      >
        <nav className="flex flex-col gap-4 w-[90svw] mx-auto my-3 max-w-[400px] sm:mx-3 relative">
          <section>
            <button
              // onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Logo className="size-[2rem] text-secondary" />
                <h1 className="text-[1.5rem]">NotesBucket</h1>
              </div>
              <Chevron className={`size-8 text-text ${rotationClass}`} />
            </button>
          </section>
          <section
            className={`${
              isExpanded ? "" : "hidden"
            } flex flex-col gap-4 max-h-[75svh] overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary `}
          >
            <CategorySelector />
            <SubjectSelector />
            <NoteSelector folders={JSON.parse(JSON.stringify(rootFolders))} />
          </section>
        </nav>
      </div>
      <main></main>
    </div>
  );
}

export const revalidate = 86400;
