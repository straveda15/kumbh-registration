import { useQuery } from '@tanstack/react-query';
import { getActivity } from '@/api/registration.api';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

export const useActivity = () => {
  const hasSession = useHasCitizenSession();

  return useQuery({
    queryKey: ['registration', 'activity'],
    queryFn: getActivity,
    enabled: hasSession,
  });
};

export default useActivity;
