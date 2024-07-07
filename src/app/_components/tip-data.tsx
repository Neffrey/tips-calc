// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import { api } from "~/trpc/react";

const TipData = () => {
  const tipData = api.tip.findAll.useQuery();
  const setTippedDates = useDataStore((state) => state.setTippedDates);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);

  // Keep Tipped Dates Updated
  useLayoutEffect(() => {
    if (tipData.data) {
      setTippedDates(tipData.data);
    }
  }, [tipData.data, setTippedDates]);

  // Keep Current Date Updated
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return null;
};

export default TipData;
