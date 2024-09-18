import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type BaseWage, type Tip } from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function twoDecimals(n: number) {
  return Math.round(n * 100) / 100;
}

export const DayHasData = ({
  date,
  dateData,
}: {
  date: Date;
  dateData: Tip[] | BaseWage[] | null | undefined;
}) => {
  let hasData = false;
  dateData?.every((data) => {
    if (data.date.getTime() === date.getTime()) {
      hasData = true;
      return false;
    }
    return true;
  });
  return hasData;
};
