import { useQuery } from '@tanstack/react-query';
import { getOverview, getTrend, getRecentActivity } from '@/api/adminAnalytics.api';

export const useAdminOverview = () =>
  useQuery({ queryKey: ['admin', 'analytics', 'overview'], queryFn: getOverview });

export const useAdminTrend = (days = 30) =>
  useQuery({ queryKey: ['admin', 'analytics', 'trend', days], queryFn: () => getTrend(days) });

export const useAdminRecentActivity = (limit = 20) =>
  useQuery({
    queryKey: ['admin', 'analytics', 'activity', limit],
    queryFn: () => getRecentActivity(limit),
  });

export default { useAdminOverview, useAdminTrend, useAdminRecentActivity };
