import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotificationStatus } from '@/api/notification.api';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useUpdateNotificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateNotificationStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);
      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) =>
        (old || []).map((item) => (item._id === id ? { ...item, status } : item))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

export default useUpdateNotificationStatus;
