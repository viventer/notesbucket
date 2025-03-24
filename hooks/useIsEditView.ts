import { usePathname } from "next/navigation";

export const useIsEditView = () => {
  const pathname = usePathname();
  return pathname.includes("edit");
};
