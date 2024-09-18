// LIBS
import { useLayoutEffect } from "react";

// UTILS
import useDataStore from "~/components/stores/data-store";

const CurrentDateSync = () => {
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);

  // Keep Current Date Updated
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return null;
};

export default CurrentDateSync;
