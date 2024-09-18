// LIBS
import { FaDollarSign } from "react-icons/fa";

// UTILS
import useDataStore from "~/components/stores/data-store";
import { cn } from "~/lib/utils";

const BaseWageInfo = () => {
  const viewDatesBaseWage = useDataStore((state) => state.viewDatesBaseWage);
  return (
    <div
      className={cn(
        "flex w-full py-1",
        viewDatesBaseWage
          ? "text-popover-foreground"
          : "text-popover-foreground/40",
      )}
    >
      <div className="flex w-full items-center justify-start gap-3">
        <FaDollarSign />
        <span>
          {viewDatesBaseWage?.amount
            ? Number(viewDatesBaseWage?.amount).toFixed(2)
            : "0"}{" "}
          Per Hour
        </span>
      </div>
    </div>
  );
};

export default BaseWageInfo;
