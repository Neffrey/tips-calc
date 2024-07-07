// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import { api } from "~/trpc/react";

const TipData = () => {
  const tipData = api.tip.findAll.useQuery();
  const setTippedDates = useDataStore((state) => state.setTippedDates);

  useLayoutEffect(() => {
    if (tipData.data) {
      setTippedDates(tipData.data);
    }
  }, [tipData.data, setTippedDates]);
  return null;
};

export default TipData;
