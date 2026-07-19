import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQrCodes, useQrCodeMutations } from '@/features/admin/hooks/useQrCodes';

export const AdminQrCodesPage = () => {
  const { data, isPending } = useQrCodes(); const { regenerate } = useQrCodeMutations(); const qrs = data?.qrs || [];
  const download = (qr) => { const link = document.createElement('a'); link.href = qr.qrImage || qr.image; link.download = `${qr.eventId?.name || 'event'}-qr.png`; link.click(); };
  const renew = async (eventId) => { try { await regenerate.mutateAsync(eventId); toast.success('QR regenerated'); } catch (err) { toast.error(err.message || 'Could not regenerate QR'); } };
  return <div className="flex flex-col gap-5"><div><h1 className="text-2xl font-semibold">QR Codes</h1><p className="text-sm text-muted-foreground">Registration entry points for every event.</p></div>{isPending ? <p>Loading QR codes…</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{qrs.map((qr) => <section key={qr._id} className="glass-card flex flex-col items-center gap-3 rounded-2xl p-5"><h2 className="font-medium">{qr.eventId?.name || 'Event QR'}</h2><img src={qr.qrImage || qr.image} alt="Event registration QR code" className="size-48 rounded-xl bg-white p-2" /><p className="text-xs text-muted-foreground">{qr.status} · {qr.scanCount} scans</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => download(qr)}><Download className="size-3.5" /> Download</Button><Button size="sm" variant="outline" onClick={() => renew(qr.eventId?._id)}><RefreshCw className="size-3.5" /> Regenerate</Button></div></section>)}</div>}</div>;
};
export default AdminQrCodesPage;
