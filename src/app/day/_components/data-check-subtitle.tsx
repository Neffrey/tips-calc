// LIBS
import { FaCheck, FaExclamationCircle } from "react-icons/fa";

// UTILS
import useDataStore from "~/components/stores/data-store";

const DataCheckSubtitle = () => {
  const dayMode = useDataStore((state) => state.dayMode);
  const viewDatesTip = useDataStore((state) => state.viewDatesTip);
  const viewDatesBaseWage = useDataStore((state) => state.viewDatesBaseWage);

  const subTitleText = () => {
    if (dayMode === "tip") {
      if (viewDatesTip) {
        return "Tip Entered";
      }
      return "No Tip Data";
    }
    if (dayMode === "basewage") {
      if (viewDatesBaseWage) {
        return "Base Wage Change Entered";
      }
      return "No Base Wage Change Data";
    }
    return "No Data";
  };

  const dataCheck = () => {
    if (dayMode === "tip") {
      return viewDatesTip;
    }
    if (dayMode === "basewage") {
      return viewDatesBaseWage;
    }
    return false;
  };

  return (
    <div className="flex items-center py-1">
      {subTitleText()}
      <div className="pl-3" />
      {dataCheck() ? (
        <FaCheck className="text-primary" />
      ) : (
        <FaExclamationCircle className="text-accent" />
      )}
    </div>
  );
};

export default DataCheckSubtitle;
