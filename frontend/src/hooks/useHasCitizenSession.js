import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';

// A citizen is "logged in" via EITHER of two independent tokens: the
// anonymous draft token from scanning a QR (useDraftSessionStore), or a
// real logged-in pilgrim account token (usePilgrimAuthStore, from /login).
// axiosClient attaches whichever is present (pilgrim token wins if both
// are), and the backend's verifyDraftAccess middleware accepts either — so
// every page/hook that gates on "is there a session" should check both,
// not just the draft token, or a pilgrim logged in on a fresh browser
// (no draft token ever issued there) would incorrectly look logged out.
export const useHasCitizenSession = () => {
  const draftToken = useDraftSessionStore((state) => state.draftToken);
  const pilgrimToken = usePilgrimAuthStore((state) => state.accessToken);
  return Boolean(draftToken) || Boolean(pilgrimToken);
};

export default useHasCitizenSession;
