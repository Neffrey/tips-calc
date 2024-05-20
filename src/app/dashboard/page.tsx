"use client";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import NotLoggedIn from "~/components/not-logged-in";
import DayRedirect from "~/components/day-redirect";

// COMPONENTS

const DashboardPage = () => {
  return (
    <ProtectedContent
      authedRoles={["ADMIN", "USER", "RESTRICTED"]}
      fallback={<NotLoggedIn />}
    >
      <DayRedirect />
    </ProtectedContent>
  );
};

export default DashboardPage;
