// LIBS
import { FaDollarSign, FaRegClock } from "react-icons/fa";

// UTILS
import useDataStore from "~/components/stores/data-store";
import { cn } from "~/lib/utils";

const TipInfo = () => {
  const viewDatesTip = useDataStore((state) => state.viewDatesTip);
  return (
    <div
      className={cn(
        "flex",
        viewDatesTip ? "text-popover-foreground" : "text-popover-foreground/40",
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <FaDollarSign />
          <span>
            {viewDatesTip?.total ? Number(viewDatesTip?.total).toFixed(2) : "0"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <FaRegClock />
          <span>
            {viewDatesTip?.hours ? Number(viewDatesTip?.hours).toFixed(2) : "0"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>$ per H</span>
          <span>
            {viewDatesTip?.perHour
              ? Number(viewDatesTip?.perHour).toFixed(2)
              : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TipInfo;
