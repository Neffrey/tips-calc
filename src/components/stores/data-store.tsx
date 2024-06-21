"use client";

// LIBS
import { create } from "zustand";

// UTILS
import {
  msUntilNextDate,
  msUntilNextMinute,
  msUntilNextSecond,
  stripTime,
} from "~/lib/time-date";

// TYPES
export type Tips =
  | {
      id: string;
      user: string;
      date: Date;
      hours: number;
      amount: number;
      cashDrawerStart: number | null;
      cashDrawerEnd: number | null;
    }[]
  | null
  | undefined;

export interface TimeStoreTypes {
  currentTime: Date;
  setCurrentTime: () => void;

  currentDate: Date;
  setCurrentDate: () => void;

  msUntilNextSecond: number;
  setMsUntilNextSecond: () => void;

  msUntilNextMinute: number;
  setMsUntilNextMinute: () => void;

  msUntilNextDate: number;
  setMsUntilNextDate: () => void;

  viewDate: Date;
  setViewDate: (date: Date) => void;

  viewMonth: Date;
  setViewMonth: (date: Date) => void;

  // viewMonthTippedDays: Date[];
  // setViewMonthTippedDays: (tippedDays: Date[]) => void;
  // removeDayFromViewMonthTippedDays: (date: Date) => void;
  // addDayToViewMonthTippedDays: (date: Date) => void;

  viewWeek: { start: Date; end: Date };
  setViewWeek: (inputDate: Date) => void;

  tips: Tips | null | undefined;
  setTips: (data: Tips) => void;
}

const useDataStore = create<TimeStoreTypes>((set, get) => ({
  currentTime: new Date(),
  setCurrentTime: () => {
    set(() => ({
      currentTime: new Date(),
    }));
  },

  currentDate: stripTime(new Date()),
  setCurrentDate: () => {
    set(() => ({
      currentDate: stripTime(new Date()),
    }));
  },

  msUntilNextSecond: msUntilNextSecond(new Date()),
  setMsUntilNextSecond: () => {
    set(() => ({
      msUntilNextSecond: msUntilNextSecond(new Date()),
    }));
  },

  msUntilNextMinute: msUntilNextMinute(new Date()),
  setMsUntilNextMinute: () => {
    set(() => ({
      msUntilNextMinute: msUntilNextMinute(new Date()),
    }));
  },

  msUntilNextDate: msUntilNextDate(new Date()),
  setMsUntilNextDate: () => {
    set(() => ({
      msUntilNextDate: msUntilNextDate(new Date()),
    }));
  },

  viewDate: stripTime(new Date()),
  setViewDate: (date: Date) => {
    set(() => ({
      viewDate: stripTime(date),
    }));
  },

  viewMonth: stripTime(new Date()),
  setViewMonth: (date: Date) => {
    set(() => ({
      viewMonth: stripTime(date),
    }));
  },

  // viewMonthTippedDays: [],
  // setViewMonthTippedDays: (dates: Date[]) => {
  //   set(() => ({
  //     viewMonthTippedDays: dates,
  //   }));
  // },
  // removeDayFromViewMonthTippedDays: (date: Date) => {
  //   set(() => ({
  //     viewMonthTippedDays: get().viewMonthTippedDays.filter(
  //       (day) => day.getTime() !== stripTime(date).getTime(),
  //     ),
  //   }));
  // },
  // addDayToViewMonthTippedDays: (date: Date) => {
  //   set(() => ({
  //     viewMonthTippedDays: get().viewMonthTippedDays.concat(stripTime(date)),
  //   }));
  // },

  viewWeek: {
    start: new Date(
      stripTime(new Date()).getTime() -
        stripTime(new Date()).getDay() * 24 * 60 * 60 * 1000,
    ),
    end: new Date(
      stripTime(new Date()).getTime() +
        (6 - stripTime(new Date()).getDay()) * 24 * 60 * 60 * 1000,
    ),
  },
  setViewWeek: (inputDate: Date) => {
    set(() => ({
      viewWeek: {
        start: new Date(
          stripTime(inputDate).getTime() -
            stripTime(inputDate).getDay() * 24 * 60 * 60 * 1000,
        ),
        end: new Date(
          stripTime(inputDate).getTime() +
            (6 - stripTime(inputDate).getDay()) * 24 * 60 * 60 * 1000,
        ),
      },
    }));
  },

  tips: null,
  setTips: (data) => set(() => ({ tips: data })),
}));

export default useDataStore;
