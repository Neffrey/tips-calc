import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Tips } from "~/components/stores/data-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function twoDecimals(n: number) {
  return Math.round(n * 100) / 100;
}

export const tippedIncludesDay = ({
  date,
  tipData,
}: {
  date: Date;
  tipData: Tips;
}) => {
  let isTipped = false;
  tipData?.every((tip) => {
    if (tip.date.getTime() === date.getTime()) {
      isTipped = true;
      return false;
    }
    return true;
  });
  return isTipped;
};
