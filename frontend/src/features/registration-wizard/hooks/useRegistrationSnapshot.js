import { useQuery } from '@tanstack/react-query';
import { getDraft } from '@/api/registration.api';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

// Read-only counterpart to useStartOrResumeDraft — used by the dashboard,
// which only ever views a registration, never starts one. Reuses the same
// cache entry (same query key) so navigating wizard -> submit -> dashboard
// in one session doesn't trigger a redundant fetch.
//
// A session here means EITHER an anonymous draft token (fresh off the
// wizard, same browser) OR a logged-in pilgrim token (from /login, any
// browser) — axiosClient attaches whichever is present, and the backend's
// verifyDraftAccess middleware resolves either to the same registration
// shape, so this hook doesn't need to know which one is actually active.
export const useRegistrationSnapshot = () => {
  const code = useDraftSessionStore((state) => state.code);
  const draftToken = useDraftSessionStore((state) => state.draftToken);
  const pilgrimToken = usePilgrimAuthStore((state) => state.accessToken);
  const hasSession = Boolean(draftToken) || Boolean(pilgrimToken);

  const query = useQuery({
    queryKey: [...DRAFT_QUERY_KEY, code || 'pilgrim-session'],
    queryFn: getDraft,
    enabled: hasSession,
    retry: false,
  });

  return { ...query, hasSession };
};

export default useRegistrationSnapshot;
