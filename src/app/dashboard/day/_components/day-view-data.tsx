// TYPES
import { type Tip } from "~/server/db/schema";

// COMPONENTS
import { Button } from "~/components/ui/button";

// COMP
const DayViewData = ({ data }: { data: Tip }) => {
  return (
    <div className="flex w-full justify-between gap-2">
      Todays Tip data
      <Button onClick={() => console.log("Todays tip data: ", data)}>
        Log Tip Data
      </Button>
    </div>
  );
};

export default DayViewData;
