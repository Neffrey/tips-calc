// LIBS
import { useLayoutEffect, useState } from "react";
import { FaDollarSign, FaRegClock } from "react-icons/fa";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import { twoDecimals } from "~/lib/utils";

// COMPONENTS
import { cn } from "~/lib/utils";
import DaySkeleton from "./day-skeleton";
import WeekControlBtns from "./week-control-btns";

// TYPES

// COMP
const WeekView = () => {
  const viewWeek = useDataStore((state) => state.viewWeek);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);
  const tips = useDataStore((state) => state.tips);

  // Keep Current Date Updated
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  // Calc UI States
  const calcViewWeekAmount = () => {
    if (!tips) {
      return 0;
    }
    return tips.reduce((acc, tip) => {
      if (tip.date >= viewWeek.from && tip.date <= viewWeek.to) {
        return (
          acc +
          Number(tip.cardTip) +
          Number(tip.cashDrawerEnd ?? 0) -
          Number(tip.cashDrawerStart ?? 0)
        );
      }
      return acc;
    }, 0);
  };

  const calcViewWeeksHours = () => {
    if (!tips) {
      return 0;
    }
    return tips.reduce((acc, tip) => {
      if (tip.date >= viewWeek.from && tip.date <= viewWeek.to) {
        return Number(acc) + Number(tip.hours);
      }
      return acc;
    }, 0);
  };

  const calcViewWeeksDays = () => {
    if (!tips) {
      return 0;
    }
    return tips.reduce(
      (acc, tip) =>
        tip.date >= viewWeek.from && tip.date <= viewWeek.to ? acc + 1 : acc,
      0,
    );
  };

  // UI STATES
  const [viewWeeksAmount, setViewWeeksAmount] =
    useState<number>(calcViewWeekAmount());
  const [viewWeeksHours, setViewWeeksHours] =
    useState<number>(calcViewWeeksHours());

  // Update UI States
  useLayoutEffect(
    () => {
      setViewWeeksAmount(calcViewWeekAmount());
      setViewWeeksHours(calcViewWeeksHours());
    },
    // eslint-disable-next-line -- only want dependency on data
    [tips, viewWeek],
  );

  // RETURN COMPONENT
  return (
    <div className="flex flex-col gap-4">
      {!tips ? (
        <DaySkeleton />
      ) : (
        <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-card px-4 py-3">
          <WeekControlBtns />
          <div
            className={cn(
              "flex flex-wrap justify-between gap-3 rounded-lg bg-popover px-6 py-5 text-popover-foreground",
              tips ? "" : "cursor-not-allowed",
            )}
          >
            <h2 className="text-xl font-bold">
              {viewWeek.from.toLocaleDateString(undefined, {
                weekday: "short",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <h2 className="text-xl font-bold">
              {viewWeek.to.toLocaleDateString(undefined, {
                weekday: "short",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div
              className={cn(
                "flex w-full",
                tips ? "text-popover-foreground" : "text-popover-foreground/40",
              )}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FaDollarSign />
                  <span>{viewWeeksAmount.toString() ?? "0"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>$ per H</span>
                  <span>
                    {viewWeeksAmount && viewWeeksHours
                      ? twoDecimals(viewWeeksAmount / viewWeeksHours).toString()
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaRegClock />
                  <span>{viewWeeksHours.toString() ?? "0"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    {"Days: "}
                    {calcViewWeeksDays().toString() ?? "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
