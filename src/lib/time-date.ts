export const dayInMs = 1000 * 60 * 60 * 24;

export const stripTime = (input: Date) => {
  return new Date(input.setHours(0, 0, 0, 0));
};

export const msUntilNextSecond = (input: Date) => {
  return 1000 - input.getMilliseconds();
};

export const msUntilNextMinute = (input: Date) => {
  return 60000 - input.getMilliseconds();
};

export const msUntilNextDate = (input: Date) => {
  const nextDay = new Date(input);
  nextDay.setDate(input.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay.getTime() - input.getTime();
};

export const getWeekday = (date: Date): string => {
  switch (date.getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Weekday Error";
  }
};

export const getMonth = (date: Date): string => {
  switch (date.getMonth()) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Month Error";
  }
};

export const getDaysDifference = (oldDate: Date, newDate = new Date()) => {
  const diff = newDate.getTime() - oldDate.getTime();
  const days = Math.floor(diff / dayInMs);
  if (days === 0) return "Today";
  if (days > 0) {
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }
  if (days < 0) {
    if (days === -1) return "Tomorrow";
    return `${Math.abs(days)} days in the future`;
  }
  return "Invalid Date Difference";
};

export const getWeekEpochs = (date: Date) => {
  const start = stripTime(date);
  start.setTime(start.getTime() - start.getDay() * dayInMs);

  const end = stripTime(date);
  end.setTime(end.getTime() + (6 - end.getDay()) * dayInMs);
  return { startEpochTime: start.getTime(), endEpochTime: end.getTime() };
};

export const getMonthEpochs = (date: Date) => {
  const start = stripTime(date);
  start.setDate(1);

  const end = stripTime(date);
  end.setMonth(end.getMonth() + 1);
  end.setDate(1);
  return { startEpochTime: start.getTime(), endEpochTime: end.getTime() };
};

export const getYearEpochs = (date: Date) => {
  const start = stripTime(date);
  start.setMonth(0);
  start.setDate(1);

  const end = start;
  end.setFullYear(end.getFullYear() + 1);
  return { startEpochTime: start.getTime(), endEpochTime: end.getTime() };
};

export const findViewMonthStart = (date: Date) => {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(
    // firstOfMonth.setTime(
    firstOfMonth.getTime() - firstOfMonth.getDay() * dayInMs,
    // ),
  );
};
export const findViewMonthEnd = (date: Date) => {
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return new Date(
    // lastOfMonth.setTime(
    lastOfMonth.getTime() + (6 - lastOfMonth.getDay()) * dayInMs,
    // ),
  );
};
