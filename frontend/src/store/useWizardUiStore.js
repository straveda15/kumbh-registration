import { create } from 'zustand';

// Pure, ephemeral UI state for the wizard shell. Not persisted — the
// authoritative "which step am I on" signal is Registration.stepStatus from
// the server; this only tracks which step the sidebar currently highlights.
export const useWizardUiStore = create((set) => ({
  activeStep: 'personalInformation',
  isSidebarOpen: true,

  setActiveStep: (step) => set({ activeStep: step }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useWizardUiStore;
