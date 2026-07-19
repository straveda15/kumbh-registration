import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listRegistrations } from '@/api/adminRegistration.api';

export const ADMIN_REGISTRATIONS_QUERY_KEY = ['admin', 'registrations'];

export const useAdminRegistrations = (filters) =>
  useQuery({
    queryKey: [...ADMIN_REGISTRATIONS_QUERY_KEY, filters],
    queryFn: () => listRegistrations(filters),
    placeholderData: keepPreviousData,
  });

export default useAdminRegistrations;
