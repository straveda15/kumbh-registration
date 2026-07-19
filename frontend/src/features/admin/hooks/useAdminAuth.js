import { useMutation, useQuery } from '@tanstack/react-query';
import { login as loginApi, logout as logoutApi, getProfile } from '@/api/adminAuth.api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export const useAdminLogin = () => {
  const setSession = useAdminAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, admin: data.admin });
    },
  });
};

export const useAdminLogout = () => {
  const clearSession = useAdminAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      clearSession();
    },
  });
};

// Was unused dead code before this refactor (GET /auth/me existed on the
// backend with nothing calling it) — now backs AdminProfilePage/
// OperatorProfilePage instead of just reading the session store's cached
// admin object, so the profile page reflects the server's current record.
export const useAdminProfile = () => {
  const accessToken = useAdminAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: getProfile,
    enabled: Boolean(accessToken),
  });
};

export default { useAdminLogin, useAdminLogout, useAdminProfile };
