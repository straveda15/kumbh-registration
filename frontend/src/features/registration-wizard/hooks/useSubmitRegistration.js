import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitRegistration } from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

export const useSubmitRegistration = (code) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRAFT_QUERY_KEY });
    },
  });
};

export default useSubmitRegistration;
