import { useQuery } from '@tanstack/react-query';
import { listNotifications } from '@/api/notification.api';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

export const useNotifications = () => {
  const hasSession = useHasCitizenSession();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
    enabled: hasSession,
  });
};

export default useNotifications;
