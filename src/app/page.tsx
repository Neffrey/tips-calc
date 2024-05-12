"use client";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import NotLoggedIn from "~/components/not-logged-in";
import OverviewRedirect from "~/components/overview-redirect";

const Home = () => {
  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<NotLoggedIn />}
      >
        <OverviewRedirect />
      </ProtectedContent>
    </div>
  );
};

export default Home;
