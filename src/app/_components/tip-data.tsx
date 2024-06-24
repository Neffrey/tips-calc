// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import { api } from "~/trpc/react";

const TipData = () => {
  const tipData = api.tip.findAll.useQuery();
  const setTips = useDataStore((state) => state.setTips);

  useLayoutEffect(() => {
    if (tipData.data) {
      setTips(tipData.data);
    }
  }, [tipData.data, setTips]);
  return null;
};

export default TipData;
