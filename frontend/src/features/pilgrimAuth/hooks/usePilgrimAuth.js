import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '@/api/pilgrimAuth.api';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';
import { DRAFT_QUERY_KEY } from '@/features/registration-wizard/hooks/useStartOrResumeDraft';

export const usePilgrimLogin = () => {
  const setSession = usePilgrimAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      queryClient.invalidateQueries({ queryKey: DRAFT_QUERY_KEY });
    },
  });
};

export default usePilgrimLogin;
