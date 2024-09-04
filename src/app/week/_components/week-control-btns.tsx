"use client";

// HELPERS
import useDataStore from "~/components/stores/data-store";

// COMPONENTS
import { Button } from "~/components/ui/button";

const WeekControlBtns = () => {
  const currentDate = useDataStore((state) => state.currentDate);
  const viewWeek = useDataStore((state) => state.viewWeek);
  const setViewWeek = useDataStore((state) => state.setViewWeek);

  // HELPERS
  const setViewAsPrevious = () => {
    setViewWeek(
      new Date(
        new Date().setTime(viewWeek.from.getTime() - 1000 * 60 * 60 * 24 * 7), // - 1 week in ms
      ),
    );
  };

  const setViewAsCurrentWeek = () => {
    setViewWeek(currentDate);
  };

  const setViewAsNext = () => {
    setViewWeek(
      new Date(
        new Date().setTime(viewWeek.from.getTime() + 1000 * 60 * 60 * 24 * 7), // + 1 week in ms
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
        Previous Week
      </Button>

      <Button
        className="w-full rounded-xl font-semibold uppercase"
        // variant={"secondary"}
        onClick={setViewAsCurrentWeek}
      >
        Go To Current Week
      </Button>

      <Button
        className="w-full from-secondary to-card/15 font-semibold uppercase hover:bg-gradient-to-r" //hover:bg-secondary-foreground/10
        variant={"secondary"}
        onClick={setViewAsNext}
      >
        Next Week
      </Button>
    </div>
  );
};

export default WeekControlBtns;
