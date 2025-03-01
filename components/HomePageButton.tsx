import Link from "next/link";

export default function Button({ text }: { text: string }) {
  const buttonContent = (
    <button
      className="bg-opacity-0 text-center w-fit rounded-2xl relative text-text font-semibold group overflow-hidden text-2xl pr-8 h-12"
      type="button"
    >
      <p className="mr-[2rem] ml-[2rem]">{text}</p>
      <div className="bg-secondary rounded-xl h-full w-[3rem] flex items-center justify-center absolute right-0 top-0 group-hover:w-full z-10 duration-500 min-w-12 text-text">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={"1.5rem"}
          height={"1.5rem"}
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z"
              fill="currentColor"
            ></path>
            <path
              opacity="0.4"
              d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </div>
    </button>
  );

  return <Link href="/browse">{buttonContent}</Link>;
}
