// LIBS
import { useEffect } from "react";

// UTILS
import useDataStore from "~/components/stores/data-store";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Calendar } from "~/components/ui/calendar";

// COMP
const WeekCalender = ({ className = "" }: { className?: string }) => {
  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const setViewDate = useDataStore((state) => state.setViewDate);
  const viewMonth = useDataStore((state) => state.viewMonth);
  const setViewMonth = useDataStore((state) => state.setViewMonth);
  const viewWeek = useDataStore((state) => state.viewWeek);
  const setViewWeek = useDataStore((state) => state.setViewWeek);

  const tips = api.tip.findAll.useQuery();

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
        mode="range"
        className="rounded-lg bg-card text-card-foreground"
        month={viewMonth}
        onMonthChange={(date) => {
          setViewMonth(date);
        }}
        selected={viewWeek}
        onDayClick={(date) => {
          if (date) {
            setViewDate(date);
            setViewWeek(date);
          }
        }}
        modifiers={{
          todaysDate: currentDate,
          tipped:
            tips?.data?.map((tip) => {
              return new Date(tip.date);
            }) ?? [],
          tippedAndViewWeek:
            tips?.data?.reduce((acc, tip) => {
              if (tip.date >= viewWeek.from && tip.date <= viewWeek.to) {
                return [...acc, new Date(tip.date)];
              }
              return acc;
            }, [] as Date[]) ?? [],
        }}
        modifiersClassNames={{
          todaysDate: "border-solid border-2 border-foreground",
          range_start: "rounded-l-2xl rounded-r-none",
          range_middle: "rounded-none",
          range_end: "rounded-r-2xl rounded-l-none",
          tipped: "bg-secondary/80 text-secondary-foreground",
          tippedAndViewWeek:
            "bg-gradient-to-br from-secondary from-50% to-primary to-50% text-primary-foreground hover:bg-primary/80",
        }}
      />
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-foreground bg-transparent" />
        Todays Date
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-primary bg-primary text-primary-foreground" />
        Selected
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md border-2 border-solid border-secondary bg-secondary text-secondary-foreground" />
        Tipped
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-secondary from-50% to-primary to-50% text-primary-foreground" />
        Selected And Tipped
      </div>
    </div>
  );
};

export default WeekCalender;
