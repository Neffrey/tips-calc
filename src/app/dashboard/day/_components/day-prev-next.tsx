"use client";

// HELPERS
import useTimeStore from "~/components/stores/time-store";
import { getDaysAgo } from "~/lib/time-date";

// COMPONENTS
import { Button } from "~/components/ui/button";

const DayPrevNext = () => {
  const currentDate = useTimeStore((state) => state.currentDate);
  const currentViewDate = useTimeStore((state) => state.currentViewDate);
  const setCurrentViewDate = useTimeStore((state) => state.setCurrentViewDate);

  // HELPERS
  const setViewAsPrevious = () => {
    setCurrentViewDate(
      new Date(
        new Date().setTime(currentViewDate.getTime() - 1000 * 60 * 60 * 24), // - 1 day in ms
      ),
    );
  };

  const setViewAsNext = () => {
    setCurrentViewDate(
      new Date(
        new Date().setTime(currentViewDate.getTime() + 1000 * 60 * 60 * 24), // + 1 day in ms
      ),
    );
  };
  return (
    <div className="flex w-2/3 justify-between gap-2">
      <Button
        className="w-1/4 font-semibold uppercase"
        onClick={setViewAsPrevious}
      >
        Previous Day
      </Button>
      <div className="flex w-1/2 flex-col text-center">
        <h2 className="text-xl font-bold">
          {currentViewDate.toLocaleDateString(undefined, {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <h3 className="">{getDaysAgo(currentViewDate, currentDate)}</h3>
      </div>
      <Button
        className="w-1/4   font-semibold uppercase"
        onClick={setViewAsNext}
      >
        Next Day
      </Button>
    </div>
  );
};

export default DayPrevNext;
