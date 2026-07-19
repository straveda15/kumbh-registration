import { useQuery } from '@tanstack/react-query';
import { listDocuments } from '@/api/document.api';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

export const DOCUMENTS_QUERY_KEY = ['documents'];

export const useDocuments = () => {
  const hasSession = useHasCitizenSession();

  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: listDocuments,
    enabled: hasSession,
  });
};

export default useDocuments;
