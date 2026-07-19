import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useScanHistory } from '@/features/operator/hooks/useScanHistory';
import { formatDateTime } from '@/utils/formatDate';

export const ScanHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const { data, isPending, isError, error } = useScanHistory(filters);

  const update = (patch) => setSearchParams({ ...filters, ...patch, page: '1' });
  const handlePageChange = (nextPage) => setSearchParams({ ...filters, page: String(nextPage) });

  const scans = data?.scans ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Scan History</h1>
        <p className="text-sm text-muted-foreground">Every gate-entry verification attempt, most recent first.</p>
      </div>

      <div className="glass-card flex flex-wrap items-end gap-3 rounded-2xl border-none p-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Result</Label>
          <Select
            value={filters.result || 'all'}
            onValueChange={(value) => update({ result: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All results</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">From</Label>
          <Input
            type="date"
            className="w-40"
            value={filters.dateFrom || ''}
            onChange={(event) => update({ dateFrom: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">To</Label>
          <Input
            type="date"
            className="w-40"
            value={filters.dateTo || ''}
            onChange={(event) => update({ dateTo: event.target.value })}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSearchParams({})} className="gap-1.5 text-muted-foreground">
          <X className="size-3.5" /> Clear
        </Button>
      </div>

      {isPending ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : isError ? (
        <p className="text-sm text-muted-foreground">{error?.message}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="glass-card overflow-x-auto rounded-2xl border-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Duplicate</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.length ? (
                  scans.map((scan) => (
                    <TableRow key={scan._id}>
                      <TableCell>{formatDateTime(scan.createdAt)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {scan.registrationId?.registrationNumber || scan.registrationId?.pilgrimId || '—'}
                      </TableCell>
                      <TableCell>{scan.operatorId?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={scan.result === 'approved' ? 'default' : 'destructive'}>
                          {scan.result === 'approved' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {scan.wasDuplicate ? <Badge variant="outline">Duplicate</Badge> : '—'}
                      </TableCell>
                      <TableCell>{scan.device || '—'}</TableCell>
                      <TableCell>{scan.browser || '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{scan.ipAddress || '—'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No scans match these filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {meta && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {meta.page} of {meta.totalPages} · {meta.total} total
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => handlePageChange(meta.page - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="size-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => handlePageChange(meta.page + 1)}
                  className="gap-1"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanHistoryPage;
