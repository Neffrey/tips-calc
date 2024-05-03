// LIBS

// UTILS
import useTimeStore from "~/components/stores/time-store";
import { cn } from "~/lib/utils";

// COMPONENTS
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { CurrentTimeDate } from "~/components/current-time-date";

// TYPES
type TipDashboardProps = {
  className?: string;
};

// COMP
const TipDashboard = ({ className = "" }: TipDashboardProps) => {
  const currentDate = useTimeStore((state) => state.currentDate);

  return (
    <div className={cn("flex flex-col justify-start gap-4", className)}>
      <h2 className="center text-2xl font-bold uppercase tracking-widest">
        Tips
      </h2>
      <div className="flex w-full justify-between gap-2">
        <Button
          className="w-1/2 font-semibold uppercase"
          onClick={() => console.log("TIPS YESTERDAY")}
        >
          Add Yesterdays
        </Button>
        <Button
          className="w-1/2 font-semibold uppercase"
          onClick={() => console.log("TIPS TODAY")}
        >
          Add Todays
        </Button>
      </div>
      <Calendar
        showOutsideDays
        mode="single"
        className="rounded-lg bg-popover text-popover-foreground"
        modifiers={{ todaysDate: currentDate }}
        modifiersClassNames={{
          todaysDate:
            "border-solid border-2 border-white bg-transparent text-foreground",
        }}
      />
      <h3 className="w-full text-center font-semibold uppercase tracking-wider">
        Current Time
      </h3>
      <CurrentTimeDate />
    </div>
  );
};

export default TipDashboard;
