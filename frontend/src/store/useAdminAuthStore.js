import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mirrors useDraftSessionStore's persisted-Zustand shape, but for the
// admin's real access-token session (refreshed via adminApiClient.js —
// see its notes on why this isn't the citizen draft token flow).
export const useAdminAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      admin: null, // { id, name, email, role }

      setSession: ({ accessToken, admin }) => set({ accessToken, admin }),

      clearSession: () => set({ accessToken: null, admin: null }),
    }),
    {
      name: 'qr-registration-admin-session',
      partialize: (state) => ({
        accessToken: state.accessToken,
        admin: state.admin,
      }),
    }
  )
);

export default useAdminAuthStore;
