import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '@/api/pilgrimAuth.api';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';
import { clearRegistrationReturnPath } from '@/utils/registrationReturnPath';

export const usePilgrimLogin = () => {
  const setSession = usePilgrimAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, user: data.user });
      // A genuine credentialed login means this is no longer a bare QR
      // draft session — drop any leftover /register/:code redirect target
      // so a future logout sends this citizen to the login page, not back
      // to a registration link that's no longer what "their session" means.
      clearRegistrationReturnPath();
    },
  });
};

export default usePilgrimLogin;
