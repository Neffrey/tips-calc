"use client";

//LIBS
import { useSession } from "next-auth/react";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import { Button } from "~/components/ui/button";
import StatsDashboard from "./_components/stats-dashboard";
import TipDashboard from "./_components/tip-dashboard";

const Home = () => {
  const { data: session } = useSession();

  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={
          <div>
            Login to track your tips and view stats like average $ per hour
          </div>
        }
      >
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
        <TipDashboard />
        <StatsDashboard />
      </ProtectedContent>
    </div>
  );
};

export default Home;
