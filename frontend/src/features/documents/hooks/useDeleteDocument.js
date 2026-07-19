import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '@/api/document.api';
import { DOCUMENTS_QUERY_KEY } from './useDocuments';

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      const previous = queryClient.getQueryData(DOCUMENTS_QUERY_KEY);
      queryClient.setQueryData(DOCUMENTS_QUERY_KEY, (old) =>
        (old || []).filter((doc) => doc._id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DOCUMENTS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });
};

export default useDeleteDocument;
