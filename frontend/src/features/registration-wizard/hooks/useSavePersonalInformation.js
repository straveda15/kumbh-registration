import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savePersonalInformation } from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

export const useSavePersonalInformation = (code) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePersonalInformation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...DRAFT_QUERY_KEY, code] });
    },
  });
};

export default useSavePersonalInformation;
