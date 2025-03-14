import Logo from "@/icons/Logo";
import HomePageButton from "@components/HomePageButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[100svh] w-[100svw] ">
      <div className="flex items-center justify-center w-fit max-w-[90svw] gap-4">
        <Logo className="hidden xl:block size-[18rem] text-secondary" />
        <section className="relative flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Logo className="size-[2.25rem] text-secondary sm:size-[4rem] md:size-[5rem] xl:hidden" />
            <h1 className="text-[2.25rem] sm:text-[4rem]  font-bold leading-none md:text-[5rem] xl:text-[8rem]">
              Notes<span className="text-secondary">Bucket</span>
            </h1>
          </div>
          <p className="text-l sm:text-xl md:text-2xl xl:text-3xl">
            Wszystkie notatki w jednym miejscu
          </p>
          <div className="absolute bottom-0 right-0 translate-y-[150%] ">
            <HomePageButton text="Przeglądaj" />
          </div>
        </section>
      </div>
    </div>
  );
}
