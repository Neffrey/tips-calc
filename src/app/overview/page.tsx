"use client";

//LIBS

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import NotLoggedIn from "~/components/not-logged-in";
import DayCalender from "../day/_components/day-calendar";

// COMPONENTS

const OverviewPage = () => {
  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<NotLoggedIn />}
      >
        <DayCalender />
      </ProtectedContent>
    </div>
  );
};

export default OverviewPage;
