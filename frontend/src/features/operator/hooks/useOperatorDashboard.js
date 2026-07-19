import { useQuery } from '@tanstack/react-query';
import { getOperatorDashboard } from '@/api/operator.api';

export const OPERATOR_DASHBOARD_QUERY_KEY = ['operator', 'dashboard'];

export const useOperatorDashboard = () =>
  useQuery({ queryKey: OPERATOR_DASHBOARD_QUERY_KEY, queryFn: getOperatorDashboard });

export default useOperatorDashboard;
