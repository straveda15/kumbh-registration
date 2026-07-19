import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The only wizard state that needs to survive a reload/closed tab and can't
// be re-derived from the server. Everything else (stepStatus, completion%,
// draft contents) lives in TanStack Query, fetched fresh from the API.
export const useDraftSessionStore = create(
  persist(
    (set) => ({
      draftToken: null,
      registrationId: null,
      eventId: null,
      code: null,

      setSession: ({ draftToken, registrationId, eventId, code }) =>
        set({ draftToken, registrationId, eventId, code }),

      clearSession: () =>
        set({ draftToken: null, registrationId: null, eventId: null, code: null }),
    }),
    {
      name: 'qr-registration-draft-session',
      partialize: (state) => ({
        draftToken: state.draftToken,
        registrationId: state.registrationId,
        eventId: state.eventId,
        code: state.code,
      }),
    }
  )
);

export default useDraftSessionStore;
