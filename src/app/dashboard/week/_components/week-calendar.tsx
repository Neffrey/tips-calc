// LIBS
import { useEffect } from "react";

// UTILS
import useDataStore from "~/components/stores/data-store";
import useTipStore from "~/components/stores/tip-store";
import { cn, tippedIncludes } from "~/lib/utils";

// COMPONENTS
import { Calendar } from "~/components/ui/calendar";

// COMP
const WeekCalender = ({ className = "" }: { className?: string }) => {
  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const setViewDate = useDataStore((state) => state.setViewDate);
  const viewMonth = useDataStore((state) => state.viewMonth);
  const setViewMonth = useDataStore((state) => state.setViewMonth);
  // const viewMonthTippedDays = useDataStore(
  //   (state) => state.viewMonthTippedDays,
  // );
  const viewWeek = useDataStore((state) => state.viewWeek);
  const setViewWeek = useDataStore((state) => state.setViewWeek);
  const tips = useTipStore((state) => state.tips);

  // Keep viewMonth in sync with viewDate
  useEffect(
    () => {
      if (
        viewDate.getMonth() !== viewMonth.getMonth() ||
        viewDate.getFullYear() !== viewMonth.getFullYear()
      ) {
        setViewMonth(viewDate);
      }
    },
    // eslint-disable-next-line -- only when viewDate changes
    [viewDate],
  );

  // COMP RETURN
  return (
    <div className={cn("flex flex-col justify-start gap-1", className)}>
      <Calendar
        showOutsideDays
        mode="single"
        className="rounded-lg bg-card text-card-foreground"
        month={viewMonth}
        onMonthChange={(date) => {
          setViewMonth(date);
        }}
        selected={viewDate}
        onSelect={(date) => {
          if (date) {
            setViewDate(date);
            setViewWeek(date);
          }
        }}
        modifiers={{
          viewDate: viewDate,
          viewWeekStart: viewWeek.start,
          viewWeekEnd: viewWeek.end,
          todaysDate: currentDate,
          tipped:
            tips?.map((tip) => {
              return new Date(tip.date);
            }) ?? [],
        }}
        modifiersClassNames={{
          todaysDate: cn(
            "border-solid border-2 bg-transparent border-foreground",
            viewDate.getTime() === currentDate.getTime()
              ? // Today === viewDate - check if tipped
                tippedIncludes({ date: currentDate, tipData: tips })
                ? // If today is viewDate & tip entered
                  "bg-gradient-to-br from-primary/80 to-secondary/100 text-primary-foreground"
                : // If today is viewDate & no tip entered
                  "bg-primary/80 text-primary-foreground"
              : // Today !== viewDate - check if tipped
                tippedIncludes({ date: currentDate, tipData: tips })
                ? // If today is not viewDate & tip entered
                  "bg-secondary/80 text-secondary-foreground"
                : // If today is not viewDate & no tip entered
                  "bg-secondary/0 text-foreground",
          ),
          selected: "bg-transparent text-primary-foreground", //border-2 border-solid
          // selected: tippedIncludes(viewDate)
          //   ? "bg-gradient-to-br from-primary/80 to-secondary/100 text-primary-foreground"
          //   : "bg-primary/80 text-primary-foreground",
          tipped: "bg-secondary/80 text-secondary-foreground",
        }}
      />
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-foreground bg-transparent" />
        Todays Date
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-primary bg-primary text-primary-foreground" />
        Selected Day
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-secondary bg-secondary text-secondary-foreground" />
        Tip Entered
      </div>
    </div>
  );
};

export default WeekCalender;
