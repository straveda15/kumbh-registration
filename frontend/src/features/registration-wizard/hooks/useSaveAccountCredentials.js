import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAccountCredentials } from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

export const useSaveAccountCredentials = (code) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAccountCredentials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DRAFT_QUERY_KEY, code] });
    },
  });
};

export default useSaveAccountCredentials;
