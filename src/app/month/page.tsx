"use client";

//LIBS
import { useSession } from "next-auth/react";

import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";

// COMPONENTS
import TipData from "~/app/_components/tip-data";
import NotLoggedIn from "~/components/not-logged-in";

const WeekPage = () => {
  const { data: session } = useSession();

  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<NotLoggedIn />}
      >
        <TipData />
        <h1 className="w-full grow text-center text-4xl font-semibold">
          Welcome
          {session?.user?.name ? (
            <Button
              variant="link"
              className="text-4xl"
              onClick={() => console.log("Change name")}
            >
              {session.user.name}
            </Button>
          ) : (
            "friend"
          )}
        </h1>

        <h2 className="w-full text-center text-2xl font-semibold">
          Month View
        </h2>
      </ProtectedContent>
    </div>
  );
};

export default WeekPage;
