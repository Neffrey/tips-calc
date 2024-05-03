// LIBS
import { useEffect } from "react";

// UTILS
import useTimeStore from "~/components/stores/time-store";
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
  const currentTime = useTimeStore((state) => state.currentTime);
  const setCurrentTime = useTimeStore((state) => state.setCurrentTime);
  const msUntilNextMinute = useTimeStore((state) => state.msUntilNextMinute);

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
  const currentDate = useTimeStore((state) => state.currentDate);
  const setCurrentDate = useTimeStore((state) => state.setCurrentDate);
  const msUntilNextDate = useTimeStore((state) => state.msUntilNextDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return <div>{`${getMonth(currentDate)} ${currentDate.getFullYear()}`}</div>;
};

export const CurrentWeekday = () => {
  const currentDate = useTimeStore((state) => state.currentDate);
  const setCurrentDate = useTimeStore((state) => state.setCurrentDate);
  const msUntilNextDate = useTimeStore((state) => state.msUntilNextDate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return <div>{getWeekday(currentDate)}</div>;
};
