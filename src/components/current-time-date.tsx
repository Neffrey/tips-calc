// LIBS
import { useEffect } from "react";

// UTILS
import useDataStore from "~/components/stores/data-store";
import { getMonth, getWeekday } from "~/lib/time-date";

export const CurrentTimeDate = () => {
  return (
    <div className="flex justify-between text-lg">
      <CurrentTime />
      <CurrentWeekday />
      <CurrentDate />
    </div>
  );
};

export const CurrentTime = () => {
  const currentTime = useDataStore((state) => state.currentTime);
  const setCurrentTime = useDataStore((state) => state.setCurrentTime);
  const msUntilNextMinute = useDataStore((state) => state.msUntilNextMinute);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime();
    }, msUntilNextMinute);

    return () => clearInterval(interval);
  }, [msUntilNextMinute, setCurrentTime]);

  return (
    <div>
      {currentTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
};

export const CurrentDate = () => {
  const currentDate = useDataStore((state) => state.currentDate);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return <div>{`${getMonth(currentDate)} ${currentDate.getFullYear()}`}</div>;
};

export const CurrentWeekday = () => {
  const currentDate = useDataStore((state) => state.currentDate);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return <div>{getWeekday(currentDate)}</div>;
};

export const useCurrentTime = () => {
  const currentTime = useDataStore((state) => state.currentTime);
  const setCurrentTime = useDataStore((state) => state.setCurrentTime);
  const msUntilNextMinute = useDataStore((state) => state.msUntilNextMinute);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime();
    }, msUntilNextMinute);

    return () => clearInterval(interval);
  }, [msUntilNextMinute, setCurrentTime]);

  return currentTime;
};

export const useCurrentDate = () => {
  const currentDate = useDataStore((state) => state.currentDate);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return currentDate;
};
