import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { RegistrationFilters } from '@/features/admin/components/RegistrationFilters';
import { RegistrationsTable } from '@/features/admin/components/RegistrationsTable';
import { ReasonDialog } from '@/features/admin/components/ReasonDialog';
import { ConfirmActionDialog } from '@/features/admin/components/ConfirmActionDialog';
import { useAdminRegistrations } from '@/features/admin/hooks/useAdminRegistrations';
import { useApprovalActions } from '@/features/admin/hooks/useApprovalActions';

// Dedicated "waiting for a decision" queue — always scoped to
// registrationStatus: 'submitted' regardless of whatever filters the admin
// picks (the Status selector itself is hidden, see RegistrationFilters'
// hideStatus prop), unlike /admin/registrations which shows every status.
// Approve/Reject/Delete reuse the exact same hooks, dialogs, and table as
// the full Registrations page so behaviour (immediate approve,
// reason-prompted reject) stays identical — this page just narrows what's
// shown and forces the status filter.
export const AdminApprovalsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rejectingId, setRejectingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const page = Number(filters.page || 1);
  const sortBy = filters.sortBy || 'submittedAt';
  const sortOrder = filters.sortOrder || 'desc';

  const queryFilters = useMemo(() => ({ ...filters, status: 'submitted' }), [filters]);
  const { data, isPending, isError, error } = useAdminRegistrations(queryFilters);

  const approveActions = useApprovalActions(approvingId);
  const rejectActions = useApprovalActions(rejectingId);
  const deleteActions = useApprovalActions(deletingId);

  const handleFiltersChange = (next) => {
    // 'status' never travels into the URL here — this page has exactly one
    // implicit status (submitted), so there is nothing for it to control.
    const { status: _status, ...rest } = next;
    const cleaned = Object.fromEntries(Object.entries(rest).filter(([, value]) => value));
    setSearchParams(cleaned);
  };

  const handleSortChange = (column, order) => {
    setSearchParams({ ...filters, sortBy: column, sortOrder: order });
  };

  const handlePageChange = (nextPage) => {
    setSearchParams({ ...filters, page: String(nextPage) });
  };

  const confirmApprove = async () => {
    try {
      await approveActions.approve.mutateAsync();
      toast.success('Registration approved');
    } catch (err) {
      toast.error(err.message || 'Could not approve registration');
    } finally {
      setApprovingId(null);
    }
  };

  const confirmReject = async (reason) => {
    try {
      await rejectActions.reject.mutateAsync(reason);
      toast.success('Registration rejected');
      setRejectingId(null);
    } catch (err) {
      toast.error(err.message || 'Could not reject registration');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteActions.remove.mutateAsync();
      toast.success('Registration deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete registration');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Registrations awaiting review — approve, reject, or open full details.
        </p>
      </div>

      <RegistrationFilters filters={filters} onChange={handleFiltersChange} hideStatus />

      {isPending ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : isError ? (
        <p className="text-sm text-muted-foreground">{error?.message}</p>
      ) : (
        <RegistrationsTable
          registrations={data?.registrations ?? []}
          meta={{ ...data?.meta, page }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          onView={(id) => navigate(`/admin/registrations/${id}`)}
          onApprove={setApprovingId}
          onReject={setRejectingId}
          onDelete={setDeletingId}
        />
      )}

      <ConfirmActionDialog
        open={Boolean(approvingId)}
        onOpenChange={(open) => !open && setApprovingId(null)}
        title="Approve this registration?"
        description="The citizen will be notified and their digital pass will show as verified."
        confirmLabel="Approve"
        onConfirm={confirmApprove}
      />

      <ReasonDialog
        open={Boolean(rejectingId)}
        onOpenChange={(open) => !open && setRejectingId(null)}
        title="Reject this registration?"
        description="The citizen will be notified with the reason below."
        confirmLabel="Reject"
        onConfirm={confirmReject}
        isSubmitting={rejectActions.reject.isPending}
      />

      <ConfirmActionDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete this registration?"
        description="This permanently removes the registration and all related records (documents, family members, digital pass). This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminApprovalsPage;
