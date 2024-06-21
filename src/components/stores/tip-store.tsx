"use client";

// LIBS
import { create } from "zustand";

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

export interface TipStoreTypes {
  tips: Tips | null | undefined;
  setTips: (data: Tips) => void;
}

const useTipStore = create<TipStoreTypes>((set) => ({
  tips: null,
  setTips: (data) => set(() => ({ tips: data })),
}));

export default useTipStore;
