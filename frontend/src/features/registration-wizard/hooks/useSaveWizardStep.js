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
      queryClient.invalidateQueries({ queryKey: [...DRAFT_QUERY_KEY, code] });
    },
  });
};

export default useSaveWizardStep;
