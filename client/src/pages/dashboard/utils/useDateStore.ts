import { create } from "zustand";

interface DateStore {
  startDate: Date | null;
  endDate: Date | null;
  eventType: string;
  date: Date | undefined;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setEventType: (event: string) => void;
  setDate: (date: Date | undefined) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  startDate: null,
  endDate: null,
  eventType: "Dont Specify",
  date: new Date(),
  setEventType: (event) => set({ eventType: event }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setDate: (date) => set({ date }),
}));
