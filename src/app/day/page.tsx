"use client";

// COMPONENTS
import NotLoggedIn from "~/components/not-logged-in";
import ProtectedContent from "~/components/protectedContent";
import useDataStore from "~/components/stores/data-store";
import { Switch } from "~/components/ui/switch";
import DayCalender from "./_components/day-calendar";
import DayView from "./_components/day-view";

const DayPage = () => {
  // STATE
  const dayMode = useDataStore((state) => state.dayMode);
  const setDayMode = useDataStore((state) => state.setDayMode);
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
        <div className="flex w-full justify-center">
          <div
            className="cursor-pointer pr-3 hover:underline"
            onClick={() => setDayMode("tip")}
          >
            Tip Mode
          </div>
          <Switch
            checked={dayMode === "basewage"}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-foreground"
            onClick={() => setDayMode(dayMode === "tip" ? "basewage" : "tip")}
          />
          <div
            className="cursor-pointer pl-3 hover:underline"
            onClick={() => setDayMode("basewage")}
          >
            Base Wage Mode
          </div>
        </div>
        <DayCalender />
        <DayView />
        {/* <DayTable /> */}
      </ProtectedContent>
    </div>
  );
};

export default DayPage;
