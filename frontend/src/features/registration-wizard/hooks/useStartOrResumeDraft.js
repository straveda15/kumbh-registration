import { useQuery } from '@tanstack/react-query';
import { startRegistration, getDraft } from '@/api/registration.api';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { decodeJwtPayload } from '@/utils/decodeJwt';

export const DRAFT_QUERY_KEY = ['registration', 'draft'];

// Orchestrates the "QR scan -> Landing -> Wizard" entry point (Part 1):
// resumes an existing draft session for this code if one is stored,
// otherwise starts a brand new one. This is the frontend's equivalent of a
// backend service function — api/ stays pure HTTP, this decides what to do.
export const useStartOrResumeDraft = (code) =>
  useQuery({
    queryKey: [...DRAFT_QUERY_KEY, code],
    enabled: Boolean(code),
    retry: false,
    staleTime: 0,
    queryFn: async () => {
      const session = useDraftSessionStore.getState();
      const canResume = Boolean(session.draftToken) && session.code === code;

      if (canResume) {
        return getDraft();
      }

      const started = await startRegistration(code);
      const claims = decodeJwtPayload(started.draftToken);

      session.setSession({
        draftToken: started.draftToken,
        registrationId: started.registrationId,
        eventId: claims?.eventId ?? null,
        code,
      });

      return {
        ...started,
        personalInformation: null,
        emergencyContact: null,
        medicalProfile: null,
        travelInformation: null,
        accommodation: null,
        familyMembers: [],
      };
    },
  });

export default useStartOrResumeDraft;
