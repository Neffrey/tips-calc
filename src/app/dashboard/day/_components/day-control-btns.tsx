"use client";

// HELPERS
import useDataStore from "~/components/stores/data-store";

// COMPONENTS
import { Button } from "~/components/ui/button";

const DayControlBtns = () => {
  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const setViewDate = useDataStore((state) => state.setViewDate);

  // HELPERS
  const setViewAsPrevious = () => {
    setViewDate(
      new Date(
        new Date().setTime(viewDate.getTime() - 1000 * 60 * 60 * 24), // - 1 day in ms
      ),
    );
  };

  const setViewAsToday = () => {
    setViewDate(currentDate);
  };

  const setViewAsNext = () => {
    setViewDate(
      new Date(
        new Date().setTime(viewDate.getTime() + 1000 * 60 * 60 * 24), // + 1 day in ms
      ),
    );
  };
  return (
    <div className="flex w-full justify-between overflow-hidden rounded-2xl bg-secondary">
      <Button
        className="w-full from-card/15 to-secondary font-semibold uppercase hover:bg-gradient-to-r"
        variant={"secondary"}
        onClick={setViewAsPrevious}
      >
        Previous Day
      </Button>

      <Button
        className="w-full rounded-xl font-semibold uppercase"
        // variant={"secondary"}
        onClick={setViewAsToday}
      >
        Go To Today
      </Button>

      <Button
        className="w-full from-secondary to-card/15 font-semibold uppercase hover:bg-gradient-to-r" //hover:bg-secondary-foreground/10
        variant={"secondary"}
        onClick={setViewAsNext}
      >
        Next Day
      </Button>
    </div>
  );
};

export default DayControlBtns;
