import { create } from "zustand";

export const useBreadcrumbStore = create((set) => ({
  dynamicCrumb: null, // e.g., { label: "Album 1" }
  setDynamicCrumb: (crumb) => set({ dynamicCrumb: crumb }),
  clearDynamicCrumb: () => set({ dynamicCrumb: null }),
}));
