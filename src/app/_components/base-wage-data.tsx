// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import { api } from "~/trpc/react";

const BaseWageData = () => {
  const baseWageData = api.baseWages.findAll.useQuery();
  const setDatesWithBaseWage = useDataStore(
    (state) => state.setDatesWithBaseWage,
  );

  // Keep Tipped Dates Updated
  useLayoutEffect(() => {
    if (baseWageData.data) {
      setDatesWithBaseWage(baseWageData.data);
    }
  }, [baseWageData.data, setDatesWithBaseWage]);

  return null;
};

export default BaseWageData;
