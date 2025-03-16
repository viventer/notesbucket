"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  const hasNoteId =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(
      pathname
    );

  const activeNoteId = hasNoteId ? pathname.split("/").pop() : "";

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Link href={`/notes/${activeNoteId}`} passHref legacyBehavior>
            <NavigationMenuLink className="transition-all border-accent ease-in-out hover:border-b-[0.1rem]">
              Przeglądaj
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/notes/edit/${activeNoteId}`} passHref legacyBehavior>
            <NavigationMenuLink className="transition-all border-accent ease-in-out hover:border-b-[0.1rem]">
              Edytuj
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/users" passHref legacyBehavior>
            <NavigationMenuLink className="transition-all border-accent ease-in-out hover:border-b-[0.1rem]">
              Użytkownicy
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
