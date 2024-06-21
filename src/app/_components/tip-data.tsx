// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import useTipStore from "~/components/stores/tip-store";
import { api } from "~/trpc/react";

const TipData = () => {
  const tipData = api.tip.findAll.useQuery();
  const tips = useTipStore((state) => state.tips);
  const setTips = useTipStore((state) => state.setTips);

  //   const memoizedTips = useMemo(() => {
  //     if (tipData.data) {
  //       return tipData.data;
  //     }
  //     return tips;
  //   }, [tipData.data, tips]);

  //   useLayoutEffect(() => {
  //     if (memoizedTips) {
  //       setTips(memoizedTips);
  //     }
  //   }, [memoizedTips, setTips]);
  //   return null;
  // };

  useLayoutEffect(() => {
    if (tipData.data) {
      setTips(tipData.data);
    }
  }, [tipData.data, setTips]);
  return null;
};

export default TipData;
