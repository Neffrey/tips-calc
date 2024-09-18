"use client";

// LIBS
import { create } from "zustand";

// UTILS
import {
  dayInMs,
  msUntilNextDate,
  msUntilNextMinute,
  msUntilNextSecond,
  stripTime,
} from "~/lib/time-date";
import { type BaseWage, type Tip } from "~/server/db/schema";

// TYPES
export type DayMode = "tip" | "basewage";

export interface DataStoreTypes {
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

  viewWeek: { from: Date; to: Date };
  setViewWeek: (inputDate: Date) => void;

  viewDatesTip: Tip | undefined | null;
  setViewDatesTip: (data: Tip | undefined | null) => void;

  viewDatesBaseWage: BaseWage | undefined | null;
  setViewDatesBaseWage: (data: BaseWage | undefined | null) => void;

  datesWithTip: Date[];
  setDatesWithTip: (data: Tip[]) => void;

  datesWithBaseWage: Date[];
  setDatesWithBaseWage: (data: BaseWage[]) => void;

  dayMode: DayMode;
  setDayMode: (mode: DayMode) => void;
}

const useDataStore = create<DataStoreTypes>((set) => ({
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

  viewWeek: {
    from: new Date(
      stripTime(new Date()).getTime() -
        stripTime(new Date()).getDay() * dayInMs,
    ),
    to: new Date(
      stripTime(new Date()).getTime() +
        (6 - stripTime(new Date()).getDay()) * dayInMs,
    ),
  },
  setViewWeek: (inputDate: Date) => {
    set(() => ({
      viewWeek: {
        from: new Date(
          stripTime(inputDate).getTime() -
            stripTime(inputDate).getDay() * dayInMs,
        ),
        to: new Date(
          stripTime(inputDate).getTime() +
            (6 - stripTime(inputDate).getDay()) * dayInMs,
        ),
      },
    }));
  },

  viewDatesTip: null,
  setViewDatesTip: (data) => set(() => ({ viewDatesTip: data })),

  viewDatesBaseWage: null,
  setViewDatesBaseWage: (data) => set(() => ({ viewDatesBaseWage: data })),

  datesWithTip: [],
  setDatesWithTip: (data) =>
    set(() => ({
      datesWithTip:
        data?.map((data) => {
          return new Date(data.date);
        }) ?? [],
    })),

  datesWithBaseWage: [],
  setDatesWithBaseWage: (data) =>
    set(() => ({
      datesWithBaseWage:
        data?.map((data) => {
          return new Date(data.date);
        }) ?? [],
    })),

  dayMode: "tip",
  setDayMode: (mode) => set(() => ({ dayMode: mode })),
}));

export default useDataStore;
