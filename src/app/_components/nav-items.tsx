"use client";

// LIBS
import Link from "next/link";
import { usePathname } from "next/navigation";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";

// TYPES
import { type NavItems } from "./nav-menu";

const NavItems = ({ items }: { items: NavItems }) => {
  const currentPath = usePathname();

  return (
    <>
      {items.map((item) => {
        return (
          <ProtectedContent
            key={`navbar-${item.title}`}
            authedRoles={item?.authedRoles}
          >
            <Link href={item.href} tabIndex={-1}>
              <Button
                variant={currentPath === item.href ? "secondary" : "ghost"}
                className="text-primary-foreground"
              >
                {item.title}
              </Button>
            </Link>
          </ProtectedContent>
        );
      })}
    </>
  );
};

export default NavItems;
