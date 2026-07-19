import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listScanHistory } from '@/api/operator.api';

export const SCAN_HISTORY_QUERY_KEY = ['operator', 'scan-history'];

export const useScanHistory = (filters) =>
  useQuery({
    queryKey: [...SCAN_HISTORY_QUERY_KEY, filters],
    queryFn: () => listScanHistory(filters),
    placeholderData: keepPreviousData,
  });

export default useScanHistory;
