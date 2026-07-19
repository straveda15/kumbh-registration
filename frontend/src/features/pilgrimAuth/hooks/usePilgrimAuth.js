import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '@/api/pilgrimAuth.api';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';

export const usePilgrimLogin = () => {
  const setSession = usePilgrimAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, user: data.user });
    },
  });
};

export default usePilgrimLogin;
