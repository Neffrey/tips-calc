import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Tips } from "~/components/stores/tip-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function twoDecimals(n: number) {
  return Math.round(n * 100) / 100;
}

export const tippedIncludes = ({
  date,
  tipData,
}: {
  date: Date;
  tipData: Tips;
}) => {
  let tipEnteredToday = false;
  tipData?.every((tip) => {
    if (tip.date.getTime() === date.getTime()) {
      tipEnteredToday = true;
      return false;
    }
    return true;
  });
  return tipEnteredToday;
};
