import { Link, useNavigate, useParams } from 'react-router-dom';
import { Download, Pencil, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvent } from '@/features/admin/hooks/useEvents';
import { useQrCodeMutations } from '@/features/admin/hooks/useQrCodes';
import { formatDateTime } from '@/utils/formatDate';

export const AdminEventDetailPage = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { data, isPending, refetch } = useEvent(id); const { regenerate } = useQrCodeMutations(); const event = data?.event; const qr = event?.qrCode;
  const regenerateCode = async () => { try { await regenerate.mutateAsync(id); await refetch(); toast.success('New QR code generated'); } catch (err) { toast.error(err.message || 'Could not regenerate QR'); } };
  const download = () => { if (!qr?.qrImage && !qr?.image) return; const link = document.createElement('a'); link.href = qr.qrImage || qr.image; link.download = `${event.name}-registration-qr.png`; link.click(); };
  if (isPending) return <p>Loading event…</p>; if (!event) return <p>Event not found.</p>;
  return <div className="flex flex-col gap-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex gap-2"><h1 className="text-2xl font-semibold">{event.name}</h1><Badge variant="outline">{event.status}</Badge></div><p className="text-sm text-muted-foreground">{event.description || 'No description'}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => navigate(`/admin/events/${id}/edit`)}><Pencil className="size-4" /> Edit</Button><Button asChild><Link to="/admin/qr-codes">All QR codes</Link></Button></div></div><div className="grid gap-4 md:grid-cols-2"><section className="glass-card rounded-2xl p-5"><h2 className="mb-3 font-medium">Event details</h2><dl className="grid gap-2 text-sm"><div>Event: {formatDateTime(event.startDate)} — {formatDateTime(event.endDate)}</div><div>Registration: {event.registrationStartDate ? formatDateTime(event.registrationStartDate) : 'Open now'} — {event.registrationEndDate ? formatDateTime(event.registrationEndDate) : 'No close date'}</div><div>Capacity: {event.capacity || 'Unlimited'}</div><div>Venue: {event.venue?.name || '—'} {event.venue?.address ? `· ${event.venue.address}` : ''}</div></dl></section><section className="glass-card flex flex-col items-center gap-4 rounded-2xl p-5"><h2 className="font-medium">Registration QR code</h2>{qr ? <><img src={qr.qrImage || qr.image} alt={`Registration QR for ${event.name}`} className="size-64 rounded-xl bg-white p-3" /><p className="break-all text-center text-xs text-muted-foreground">{qr.qrUrl || qr.url}</p><div className="flex gap-2"><Button variant="outline" onClick={download}><Download className="size-4" /> Download</Button><Button variant="outline" onClick={regenerateCode} disabled={regenerate.isPending}><RefreshCw className="size-4" /> Regenerate</Button></div></> : <p className="text-sm text-muted-foreground">No QR code found.</p>}</section></div></div>;
};
export default AdminEventDetailPage;
