// LIBS
import { useLayoutEffect } from "react";

// UTILS
import useDataStore from "~/components/stores/data-store";
import { cn, DayHasData } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Calendar } from "~/components/ui/calendar";

// COMP
const DayCalender = ({ className = "" }: { className?: string }) => {
  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const setViewDate = useDataStore((state) => state.setViewDate);
  const viewMonth = useDataStore((state) => state.viewMonth);
  const setViewMonth = useDataStore((state) => state.setViewMonth);
  const dayMode = useDataStore((state) => state.dayMode);

  const tipData = api.tip.findAll.useQuery();
  const baseWageData = api.baseWage.findAll.useQuery();

  // Get Dates With Data depending on dayMode
  const datesWithData = () => {
    if (dayMode === "tip" && tipData.data) {
      return tipData.data.map((data) => data.date);
    }
    if (dayMode === "basewage" && baseWageData.data) {
      return baseWageData.data.map((data) => data.date);
    }
    return [];
  };

  // Keep viewMonth in sync with viewDate
  useLayoutEffect(
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

  const modeData = () => {
    switch (dayMode) {
      case "tip":
        return tipData?.data;
      case "basewage":
        return baseWageData?.data;
      default:
        return null;
    }
  };

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
          }
        }}
        modifiers={{
          todaysDate: currentDate,
          hasData: datesWithData(),
        }}
        modifiersClassNames={{
          todaysDate: "border-solid border-2 border-foreground",
          selected: DayHasData({
            date: viewDate,
            dateData: modeData(),
          })
            ? "bg-gradient-to-br from-secondary from-50% to-primary to-50% text-primary-foreground"
            : "bg-primary/80 text-primary-foreground",
          hasData: "bg-secondary/80 text-secondary-foreground",
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
        {dayMode === "basewage" ? "BaseWage Change" : "Tipped"}
      </div>
      <div className="flex w-full items-start gap-4 p-2">
        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-secondary from-50% to-primary to-50% text-primary-foreground" />
        Selected And {dayMode === "basewage" ? "BaseWage Change" : "Tipped"}
      </div>
    </div>
  );
};

export default DayCalender;
