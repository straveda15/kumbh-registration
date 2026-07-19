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

export const AdminRegistrationsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rejectingId, setRejectingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const page = Number(filters.page || 1);
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';

  const { data, isPending, isError, error } = useAdminRegistrations(filters);

  // Actions dialogs operate on whichever row triggered them, so the
  // mutations hook is scoped to that id, resolved lazily.
  const approveActions = useApprovalActions(approvingId);
  const rejectActions = useApprovalActions(rejectingId);
  const deleteActions = useApprovalActions(deletingId);

  const handleFiltersChange = (next) => {
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
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
        <h1 className="text-2xl font-semibold text-foreground">Registrations</h1>
        <p className="text-sm text-muted-foreground">Search, filter, and manage citizen registrations.</p>
      </div>

      <RegistrationFilters filters={filters} onChange={handleFiltersChange} />

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

export default AdminRegistrationsPage;
