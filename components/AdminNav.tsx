import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Upewnij się, że ścieżki odpowiadają Twojej strukturze projektu

export function AdminNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <Link href="/notes" passHref legacyBehavior>
            <NavigationMenuLink className="transition-all border-accent ease-in-out hover:border-b-[0.1rem]">
              Przeglądaj
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/notes/edit" passHref legacyBehavior>
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
