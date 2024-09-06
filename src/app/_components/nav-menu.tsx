// LIBS
import Link from "next/link";

// HELPERS
import { getServerAuthSession } from "~/server/auth";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import LoginBtn from "./login-btn";
import Items from "./nav-items";

// TYPES
import { type UserRole } from "~/server/db/schema";

export type NavItems = {
  title: string;
  href: string;
  authedRoles?: UserRole[] | undefined;
}[];

// Nav items
const navItems: NavItems = [
  { title: "Day", href: "/day", authedRoles: ["ADMIN", "USER"] },
  {
    title: "Week",
    href: "/week",
    authedRoles: ["ADMIN", "USER"],
  },
  {
    title: "Month",
    href: "/month",
    authedRoles: ["ADMIN", "USER"],
  },
  {
    title: "Year",
    href: "/year",
    authedRoles: ["ADMIN", "USER"],
  },
  {
    title: "Base Wage",
    href: "/basewage",
    authedRoles: ["ADMIN", "USER"],
  },

  { title: "Users", href: "/users", authedRoles: ["ADMIN"] },
];

const NavMenu = async () => {
  const session = await getServerAuthSession();

  return (
    <div
      // Nav Menu
      className="flex items-center justify-start gap-6"
    >
      <Items items={navItems} />
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<LoginBtn />}
      >
        <Link
          className="flex items-end justify-start gap-3"
          href="account"
          tabIndex={-1}
        >
          <Button variant={"link"} className="text-primary-foreground">
            {session?.user?.name ? session.user.name : "Account"}
          </Button>
          <Avatar>
            <AvatarImage
              src={session?.user?.image ? session.user.image : ""}
              alt={`${session?.user.name} profile picture`}
            />
            <AvatarFallback>
              {session?.user?.name ? session?.user?.name.slice(0, 1) : ""}
            </AvatarFallback>
          </Avatar>
        </Link>
      </ProtectedContent>
    </div>
  );
};

export default NavMenu;
