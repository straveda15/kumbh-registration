import { create } from 'zustand';

// Pure, ephemeral admin-layout UI state — mirrors useWizardUiStore's shape.
export const useAdminUiStore = create((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
}));

export default useAdminUiStore;
