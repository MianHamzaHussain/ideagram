import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  user: any | null;
  toggleSidebar: () => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  user: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
