// LIBS

// UTILS
import useTimeStore from "~/components/stores/time-store";
import { cn } from "~/lib/utils";

// COMPONENTS
import { Calendar } from "~/components/ui/calendar";

// TYPES
type DayCalenderProps = {
  className?: string;
};

// COMP
const DayCalender = ({ className = "" }: DayCalenderProps) => {
  const currentDate = useTimeStore((state) => state.currentDate);
  const currentViewDate = useTimeStore((state) => state.currentViewDate);
  const setCurrentViewDate = useTimeStore((state) => state.setCurrentViewDate);

  return (
    <div className={cn("flex flex-col justify-start gap-1", className)}>
      <Calendar
        showOutsideDays
        mode="single"
        className="rounded-lg bg-card text-card-foreground"
        selected={currentViewDate}
        onSelect={(date) => {
          if (date) setCurrentViewDate(date);
        }}
        modifiers={{ todaysDate: currentDate }}
        modifiersClassNames={{
          todaysDate:
            "border-solid border-2 border-foreground bg-transparent text-foreground",
          selected:
            "bg-primary text-primary-foreground border-solid border-2 border-primary",
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

export default DayCalender;
