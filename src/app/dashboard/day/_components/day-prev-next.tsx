"use client";

// HELPERS
import useTimeStore from "~/components/stores/time-store";

// COMPONENTS
import { Button } from "~/components/ui/button";

const DayPrevNext = () => {
  const viewDate = useTimeStore((state) => state.viewDate);
  const setViewDate = useTimeStore((state) => state.setViewDate);

  // HELPERS
  const setViewAsPrevious = () => {
    setViewDate(
      new Date(
        new Date().setTime(viewDate.getTime() - 1000 * 60 * 60 * 24), // - 1 day in ms
      ),
    );
  };

  const setViewAsNext = () => {
    setViewDate(
      new Date(
        new Date().setTime(viewDate.getTime() + 1000 * 60 * 60 * 24), // + 1 day in ms
      ),
    );
  };
  return (
    <div className="flex w-full justify-between gap-8 px-5 pb-4 ">
      <Button
        className="w-full bg-secondary/70 font-semibold uppercase"
        variant={"secondary"}
        onClick={setViewAsPrevious}
      >
        Previous Day
      </Button>

      <Button
        className="w-full bg-secondary/70 font-semibold uppercase"
        variant={"secondary"}
        onClick={setViewAsNext}
      >
        Next Day
      </Button>
    </div>
  );
};

export default DayPrevNext;
