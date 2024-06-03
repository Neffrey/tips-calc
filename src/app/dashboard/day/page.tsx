"use client";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";
import NotLoggedIn from "~/components/not-logged-in";
import DayCalender from "./_components/day-calendar";
import DayView from "./_components/day-view";

const DayPage = () => {
  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<NotLoggedIn />}
      >
        <h1 className="center w-full text-center text-3xl font-bold uppercase tracking-widest">
          Day Tracker
        </h1>
        <DayCalender />
        <DayView />
      </ProtectedContent>
    </div>
  );
};

export default DayPage;
