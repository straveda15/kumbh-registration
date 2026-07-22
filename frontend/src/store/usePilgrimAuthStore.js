import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mirrors useAdminAuthStore's shape, but for a logged-in pilgrim's own
// account session — completely separate token/store from both
// useAdminAuthStore (Admin) and useDraftSessionStore (the anonymous
// per-registration wizard token). See backend/src/middlewares/
// draftAuth.middleware.js for how the two citizen-facing tokens
// (draft vs pilgrim) both resolve to the same registration-access shape.
export const usePilgrimAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null, // { id, fullName, email, mobile }

      setSession: ({ accessToken, user }) => set({ accessToken, user }),

      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'qr-registration-pilgrim-session',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

export default usePilgrimAuthStore;
