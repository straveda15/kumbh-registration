import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAccountCredentials } from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

export const useSaveAccountCredentials = (code) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAccountCredentials,
    onSuccess: () => {
      // Must match useRegistrationSnapshot/useStartOrResumeDraft's own key
      // exactly (code || 'pilgrim-session') — a pilgrim who logged in with
      // Registration Number + Password on a fresh browser has no draft
      // `code` at all, so invalidating the bare `code` (undefined/null)
      // would silently miss the actual cached query and the Profile page
      // wouldn't refresh after a save.
      queryClient.invalidateQueries({ queryKey: [...DRAFT_QUERY_KEY, code || 'pilgrim-session'] });
    },
  });
};

export default useSaveAccountCredentials;
