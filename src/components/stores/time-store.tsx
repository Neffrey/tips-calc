"use client";

// LIBS
import { create } from "zustand";

// UTILS
import {
  stripTime,
  msUntilNextSecond,
  msUntilNextMinute,
  msUntilNextDate,
} from "~/lib/time-date";

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
}

const useTimeStore = create<TimeStoreTypes>((set) => ({
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
}));

export default useTimeStore;
