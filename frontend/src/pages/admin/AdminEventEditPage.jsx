import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { EventForm } from '@/features/admin/components/EventForm';
import { useEvent, useEventMutations } from '@/features/admin/hooks/useEvents';

export const AdminEventEditPage = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { data, isPending } = useEvent(id); const { update } = useEventMutations();
  const submit = async (payload) => { try { await update.mutateAsync({ id, payload }); toast.success('Event updated'); navigate(`/admin/events/${id}`); } catch (err) { toast.error(err.message || 'Could not update event'); } };
  if (isPending) return <p>Loading event…</p>;
  return <div className="flex flex-col gap-5"><div><h1 className="text-2xl font-semibold">Edit Event</h1></div><EventForm initialEvent={data?.event} onSubmit={submit} isSubmitting={update.isPending} /></div>;
};
export default AdminEventEditPage;
