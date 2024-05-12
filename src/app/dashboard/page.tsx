"use client";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import NotLoggedIn from "~/components/not-logged-in";
import OverviewRedirect from "~/components/overview-redirect";

// COMPONENTS

const DashboardPage = () => {
  return (
    <ProtectedContent
      authedRoles={["ADMIN", "USER", "RESTRICTED"]}
      fallback={<NotLoggedIn />}
    >
      <OverviewRedirect />
    </ProtectedContent>
  );
};

export default DashboardPage;
