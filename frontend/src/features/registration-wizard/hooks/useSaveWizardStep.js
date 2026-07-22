import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

// Generic replacement for a per-step mutation hook: every singular step
// (emergency/medical/travel/accommodation, and personal before it) saves
// via the exact same PUT-then-invalidate-the-draft-query shape, so this is
// parametrized by which api/registration.api.js function to call instead
// of re-declaring the same hook four more times.
export const useSaveWizardStep = (code, saveFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveFn,
    onSuccess: () => {
      // Must match useRegistrationSnapshot/useStartOrResumeDraft's own key
      // exactly (code || 'pilgrim-session') — a pilgrim who logged in with
      // Registration Number + Password on a fresh browser has no draft
      // `code` at all, so invalidating the bare `code` (undefined/null)
      // would silently miss the actual cached query (see
      // useSaveAccountCredentials for the same fix).
      queryClient.invalidateQueries({ queryKey: [...DRAFT_QUERY_KEY, code || 'pilgrim-session'] });
    },
  });
};

export default useSaveWizardStep;
