import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvents, useEventMutations } from '@/features/admin/hooks/useEvents';
import { formatDateTime } from '@/utils/formatDate';

export const AdminEventsPage = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useEvents();
  const { remove } = useEventMutations();
  const events = data?.events || [];

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event? Events with registrations cannot be deleted.')) return;
    try { await remove.mutateAsync(id); toast.success('Event deleted'); }
    catch (err) { toast.error(err.message || 'Could not delete event'); }
  };

  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Events</h1><p className="text-sm text-muted-foreground">Create events and manage their registration QR codes.</p></div><Button asChild><Link to="/admin/events/new"><Plus className="size-4" /> Create Event</Link></Button></div>
    {isPending ? <p>Loading events…</p> : error ? <p className="text-destructive">{error.message}</p> : <div className="glass-card overflow-x-auto rounded-2xl"><table className="w-full text-left text-sm"><thead className="border-b border-white/10 text-muted-foreground"><tr><th className="p-4">Event</th><th className="p-4">Dates</th><th className="p-4">Venue</th><th className="p-4">Capacity</th><th className="p-4">Status</th><th className="p-4" /></tr></thead><tbody>{events.map((event) => <tr key={event._id} className="border-b border-white/5"><td className="p-4 font-medium">{event.name}</td><td className="p-4">{formatDateTime(event.startDate)}</td><td className="p-4">{event.venue?.name || '—'}</td><td className="p-4">{event.capacity || 'Unlimited'}</td><td className="p-4"><Badge variant="outline">{event.status}</Badge></td><td className="flex gap-2 p-3"><Button size="icon" variant="ghost" onClick={() => navigate(`/admin/events/${event._id}`)}><QrCode className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => navigate(`/admin/events/${event._id}/edit`)}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => deleteEvent(event._id)}><Trash2 className="size-4 text-destructive" /></Button></td></tr>)}{!events.length && <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">No events yet. Create one to generate its registration QR code.</td></tr>}</tbody></table></div>}
  </div>;
};

export default AdminEventsPage;
