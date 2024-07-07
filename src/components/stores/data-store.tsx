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
import { type Tip } from "~/server/db/schema";

// TYPES
export type Tips = Tip[] | null | undefined;

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

  viewWeek: { from: Date; to: Date };
  setViewWeek: (inputDate: Date) => void;

  tippedDates: Date[];
  setTippedDates: (data: Tips) => void;
}

const useDataStore = create<TimeStoreTypes>((set) => ({
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
        stripTime(new Date()).getDay() * 24 * 60 * 60 * 1000,
    ),
    to: new Date(
      stripTime(new Date()).getTime() +
        (6 - stripTime(new Date()).getDay()) * 24 * 60 * 60 * 1000,
    ),
  },
  setViewWeek: (inputDate: Date) => {
    set(() => ({
      viewWeek: {
        from: new Date(
          stripTime(inputDate).getTime() -
            stripTime(inputDate).getDay() * 24 * 60 * 60 * 1000,
        ),
        to: new Date(
          stripTime(inputDate).getTime() +
            (6 - stripTime(inputDate).getDay()) * 24 * 60 * 60 * 1000,
        ),
      },
    }));
  },

  tippedDates: [],
  setTippedDates: (data) =>
    set(() => ({
      tippedDates:
        data?.map((tip) => {
          return new Date(tip.date);
        }) ?? [],
    })),
}));

export default useDataStore;
