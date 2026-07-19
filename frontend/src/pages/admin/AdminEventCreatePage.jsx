import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EventForm } from '@/features/admin/components/EventForm';
import { useEventMutations } from '@/features/admin/hooks/useEvents';

export const AdminEventCreatePage = () => {
  const navigate = useNavigate(); const { create } = useEventMutations();
  const submit = async (payload) => { try { const result = await create.mutateAsync(payload); toast.success('Event and registration QR created'); navigate(`/admin/events/${result.event._id}`); } catch (err) { toast.error(err.message || 'Could not create event'); } };
  return <div className="flex flex-col gap-5"><div><h1 className="text-2xl font-semibold">Create Event</h1><p className="text-sm text-muted-foreground">A registration QR code is generated automatically.</p></div><EventForm onSubmit={submit} isSubmitting={create.isPending} submitLabel="Create Event" /></div>;
};
export default AdminEventCreatePage;
