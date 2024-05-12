"use client";

// LIBS
import { useEffect } from "react";

// HELPERS
import { api } from "~/trpc/react";
import useTimeStore from "~/components/stores/time-store";

// COMPONENTS
import DaySkeleton from "./day-skeleton";
import DayViewData from "./day-view-data";
import DayEnterTip from "./day-enter-tip";

// COMP
const DayView = () => {
  const setCurrentDate = useTimeStore((state) => state.setCurrentDate);
  const currentViewDate = useTimeStore((state) => state.currentViewDate);
  const msUntilNextDate = useTimeStore((state) => state.msUntilNextDate);

  // QUERIES
  const viewDatesTip = api.tip.getTip.useQuery({
    date: currentViewDate,
  });

  // Keep Current Date Updated
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return (
    <div className="flex w-1/2 flex-col gap-4">
      {viewDatesTip.isLoading && viewDatesTip.data ? (
        // isLoading === true
        <DaySkeleton />
      ) : viewDatesTip.data ? (
        // isLoading === false && data exists
        <DayViewData data={viewDatesTip.data} />
      ) : (
        // isLoading === false && data does not exist
        <DayEnterTip date={currentViewDate} />
      )}
    </div>
  );
};

export default DayView;
