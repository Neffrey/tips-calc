"use client";

// LIBS

// UTILS

// COMPONENTS
import NotLoggedIn from "~/components/not-logged-in";
import ProtectedContent from "~/components/protectedContent";
import WeekCalender from "./_components/week-calendar";
import WeekView from "./_components/week-view";

// TYPES
export type TipData =
  | {
      id: string;
      user: string;
      date: Date;
      hours: number;
      amount: number;
      cashDrawerStart: number | null;
      cashDrawerEnd: number | null;
    }[]
  | null
  | undefined;

const WeekPage = () => {
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
          Week Tracker
        </h1>
        <WeekCalender />
        <WeekView />
        {/* <div className="flex flex-col">
          monthStart: {findViewMonthStart(viewMonth).toLocaleDateString()}
          monthEnd: {findViewMonthEnd(viewMonth).toLocaleDateString()}
        </div> */}
      </ProtectedContent>
    </div>
  );
};

export default WeekPage;
