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
    try {
      await remove.mutateAsync(id);
      toast.success('Event deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete event');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground">Create events and manage their registration QR codes.</p>
        </div>
        <Button asChild>
          <Link to="/admin/events/new">
            <Plus className="size-4" /> Create Event
          </Link>
        </Button>
      </div>

      {isPending ? (
        <p>Loading events…</p>
      ) : error ? (
        <p className="text-destructive">{error.message}</p>
      ) : events.length === 0 ? (
        <div className="glass-card rounded-2xl border-none p-8 text-center text-muted-foreground">
          No events yet. Create one to generate its registration QR code.
        </div>
      ) : (
        <>
          {/* Mobile: one card per event instead of a horizontally-scrolling
              table. */}
          <div className="flex flex-col gap-3 md:hidden">
            {events.map((event) => (
              <div key={event._id} className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate font-semibold text-foreground">{event.name}</p>
                  <Badge variant="outline" className="shrink-0 capitalize">
                    {event.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                  <div className="min-w-0">
                    <p className="text-muted-foreground">Venue</p>
                    <p className="truncate font-medium text-foreground">{event.venue?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dates</p>
                    <p className="font-medium text-foreground">{formatDateTime(event.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium text-foreground">
                      {event.capacity ? event.capacity.toLocaleString() : 'Unlimited'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 flex-1 gap-1.5"
                    onClick={() => navigate(`/admin/events/${event._id}`)}
                  >
                    <QrCode className="size-3.5" /> View QR
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 flex-1 gap-1.5"
                    onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 shrink-0" onClick={() => deleteEvent(event._id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card hidden overflow-x-auto rounded-2xl md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-muted-foreground">
                <tr>
                  <th className="p-4">Event</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-white/5">
                    <td className="p-4 font-medium">{event.name}</td>
                    <td className="p-4">{formatDateTime(event.startDate)}</td>
                    <td className="p-4">{event.venue?.name || '—'}</td>
                    <td className="p-4">{event.capacity ? event.capacity.toLocaleString() : 'Unlimited'}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {event.status}
                      </Badge>
                    </td>
                    <td className="flex gap-2 p-3">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/events/${event._id}`)}>
                        <QrCode className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/events/${event._id}/edit`)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteEvent(event._id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEventsPage;
