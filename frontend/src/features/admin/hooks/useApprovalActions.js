import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveRegistration,
  rejectRegistration,
  requestMoreInfo,
  suspendRegistration,
  restoreRegistration,
  deleteRegistration,
} from '@/api/adminRegistration.api';
import { ADMIN_REGISTRATIONS_QUERY_KEY } from './useAdminRegistrations';

const useRegistrationAction = (mutationFn, id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_REGISTRATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'registration', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
  });
};

// One hook bundling every status-transition action a registration detail
// view or table row needs — each just a thin wrapper over the matching
// api/adminRegistration.api.js function, all sharing the same
// invalidation (list + this detail) so the UI never goes stale.
export const useApprovalActions = (id) => ({
  approve: useRegistrationAction(() => approveRegistration(id), id),
  reject: useRegistrationAction((reason) => rejectRegistration(id, reason), id),
  requestInfo: useRegistrationAction((reason) => requestMoreInfo(id, reason), id),
  suspend: useRegistrationAction((reason) => suspendRegistration(id, reason), id),
  restore: useRegistrationAction(() => restoreRegistration(id), id),
  remove: useRegistrationAction(() => deleteRegistration(id), id),
});

export default useApprovalActions;
