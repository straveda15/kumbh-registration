import { useQuery } from '@tanstack/react-query';
import { getOverview, getTrend } from '@/api/adminAnalytics.api';

export const useAdminOverview = () =>
  useQuery({ queryKey: ['admin', 'analytics', 'overview'], queryFn: getOverview });

export const useAdminTrend = (days = 30) =>
  useQuery({ queryKey: ['admin', 'analytics', 'trend', days], queryFn: () => getTrend(days) });

export default { useAdminOverview, useAdminTrend };
