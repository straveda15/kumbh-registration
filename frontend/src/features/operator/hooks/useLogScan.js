import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logScan } from '@/api/operator.api';
import { SCAN_HISTORY_QUERY_KEY } from './useScanHistory';
import { OPERATOR_DASHBOARD_QUERY_KEY } from './useOperatorDashboard';

export const useLogScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logScan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCAN_HISTORY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: OPERATOR_DASHBOARD_QUERY_KEY });
    },
  });
};

export default useLogScan;
