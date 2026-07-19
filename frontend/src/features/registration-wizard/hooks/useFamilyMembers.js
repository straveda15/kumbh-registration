import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  saveFamilyMembers,
} from '@/api/registration.api';
import { DRAFT_QUERY_KEY } from './useStartOrResumeDraft';

const queryKeyFor = (code) => [...DRAFT_QUERY_KEY, code];

// No separate GET /registration/family query — getDraft (already fetched
// by useStartOrResumeDraft) already returns the full familyMembers array,
// so re-querying it here would be an unnecessary refetch. Each mutation
// below patches that same cache entry optimistically for instant list
// feedback, then invalidates on settle to pick up the server's
// authoritative stepStatus/completionPercentage (derived server-side by
// syncFamilyStepStatus) without re-deriving that logic on the client.
const useOptimisticFamilyMutation = (code, mutationFn, updater) => {
  const queryClient = useQueryClient();
  const key = queryKeyFor(code);

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previousDraft = queryClient.getQueryData(key);
      if (previousDraft) {
        queryClient.setQueryData(key, updater(previousDraft, variables));
      }
      return { previousDraft };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDraft) {
        queryClient.setQueryData(key, context.previousDraft);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};

export const useFamilyMembers = (code) => {
  const add = useOptimisticFamilyMutation(code, addFamilyMember, (draft, payload) => ({
    ...draft,
    familyMembers: [
      ...(draft.familyMembers || []),
      { _id: `optimistic-${Date.now()}`, data: payload, status: 'completed' },
    ],
  }));

  const update = useOptimisticFamilyMutation(
    code,
    ({ id, payload }) => updateFamilyMember(id, payload),
    (draft, { id, payload }) => ({
      ...draft,
      familyMembers: (draft.familyMembers || []).map((member) =>
        member._id === id ? { ...member, data: payload } : member
      ),
    })
  );

  const remove = useOptimisticFamilyMutation(code, deleteFamilyMember, (draft, id) => ({
    ...draft,
    familyMembers: (draft.familyMembers || []).filter((member) => member._id !== id),
  }));

  const bulkReplace = useOptimisticFamilyMutation(code, saveFamilyMembers, (draft, members) => ({
    ...draft,
    familyMembers: members.map((data, index) => ({ _id: `optimistic-${index}`, data })),
  }));

  return { add, update, remove, bulkReplace };
};

export default useFamilyMembers;
