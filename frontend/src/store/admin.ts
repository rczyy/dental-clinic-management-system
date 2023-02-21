import { create } from "zustand";

interface AdminState {
  sidebar: boolean;
  toggleSidebar: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  sidebar: window.innerWidth >= 768,
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
}));
