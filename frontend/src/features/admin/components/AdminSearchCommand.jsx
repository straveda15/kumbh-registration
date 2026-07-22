import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, CalendarDays, QrCode, ClipboardCheck, Search } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { listRegistrations } from '@/api/adminRegistration.api';
import { listEvents } from '@/api/event.api';
import { listQR } from '@/api/qr.api';

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 5;

// Real, live, case-insensitive, partial-match search across every admin
// entity that still exists in the app — Registrations, Pending Approvals
// (a status-scoped view of Registrations), Events, and QR Codes. Search
// intentionally does NOT cover Notifications or Operators: both features
// were fully removed from the app (frontend UI and, for Notifications, the
// HTTP layer) in an earlier change, so there is nothing left to search.
export const AdminSearchCommand = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Debounce so results aren't refetched on every single keystroke —
  // still "immediately" from the user's perspective at this delay.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const searchEnabled = open && debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data: registrationData, isFetching: isFetchingRegistrations } = useQuery({
    queryKey: ['admin', 'search', 'registrations', debouncedQuery],
    queryFn: () => listRegistrations({ search: debouncedQuery, limit: RESULT_LIMIT }),
    enabled: searchEnabled,
  });

  const { data: approvalData, isFetching: isFetchingApprovals } = useQuery({
    queryKey: ['admin', 'search', 'approvals', debouncedQuery],
    queryFn: () => listRegistrations({ search: debouncedQuery, status: 'submitted', limit: RESULT_LIMIT }),
    enabled: searchEnabled,
  });

  const { data: eventData, isFetching: isFetchingEvents } = useQuery({
    queryKey: ['admin', 'search', 'events', debouncedQuery],
    queryFn: () => listEvents({ search: debouncedQuery, limit: RESULT_LIMIT }),
    enabled: searchEnabled,
  });

  // QR codes have no server-side search param (listQR only filters by
  // eventId/status) — the full list is small enough for an admin's own QR
  // Codes page to already fetch it whole, so mirror that here and filter
  // client-side instead of adding a new backend query param.
  const { data: qrData, isFetching: isFetchingQr } = useQuery({
    queryKey: ['admin', 'search', 'qr-all'],
    queryFn: () => listQR(),
    enabled: searchEnabled,
    staleTime: 30_000,
  });

  const registrations = registrationData?.registrations || [];
  const approvals = approvalData?.registrations || [];
  const events = eventData?.events || [];

  const filteredQr = useMemo(() => {
    if (!searchEnabled) return [];
    const needle = debouncedQuery.toLowerCase();
    return (qrData?.qrs || [])
      .filter(
        (qr) =>
          qr.uniqueCode?.toLowerCase().includes(needle) ||
          qr.eventCode?.toLowerCase().includes(needle) ||
          qr.eventId?.name?.toLowerCase().includes(needle)
      )
      .slice(0, RESULT_LIMIT);
  }, [qrData, debouncedQuery, searchEnabled]);

  const isSearching =
    searchEnabled && (isFetchingRegistrations || isFetchingApprovals || isFetchingEvents || isFetchingQr);
  const hasAnyResults =
    registrations.length > 0 || approvals.length > 0 || events.length > 0 || filteredQr.length > 0;

  const go = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search registrations, events, QR codes…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
        {!searchEnabled && (
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => go('/admin')}>
              <LayoutDashboard className="size-4" /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => go('/admin/registrations')}>
              <Users className="size-4" /> Registrations
            </CommandItem>
            <CommandItem onSelect={() => go('/admin/approvals')}>
              <ClipboardCheck className="size-4" /> Pending Approvals
            </CommandItem>
            <CommandItem onSelect={() => go('/admin/events')}>
              <CalendarDays className="size-4" /> Events
            </CommandItem>
            <CommandItem onSelect={() => go('/admin/qr-codes')}>
              <QrCode className="size-4" /> QR Codes
            </CommandItem>
          </CommandGroup>
        )}

        {searchEnabled && !isSearching && !hasAnyResults && (
          <CommandEmpty>No results found for &ldquo;{debouncedQuery}&rdquo;.</CommandEmpty>
        )}

        {searchEnabled && registrations.length > 0 && (
          <CommandGroup heading="Registrations">
            {registrations.map((reg) => (
              <CommandItem key={reg._id} onSelect={() => go(`/admin/registrations/${reg._id}`)}>
                <Users className="size-4" />
                <span className="truncate">
                  {reg.personal?.data?.fullName || 'Unnamed'} · {reg.registrationNumber || reg.pilgrimId}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchEnabled && approvals.length > 0 && (
          <CommandGroup heading="Pending Approvals">
            {approvals.map((reg) => (
              <CommandItem key={reg._id} onSelect={() => go(`/admin/registrations/${reg._id}`)}>
                <ClipboardCheck className="size-4" />
                <span className="truncate">
                  {reg.personal?.data?.fullName || 'Unnamed'} · Awaiting review
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchEnabled && events.length > 0 && (
          <CommandGroup heading="Events">
            {events.map((event) => (
              <CommandItem key={event._id} onSelect={() => go(`/admin/events/${event._id}`)}>
                <CalendarDays className="size-4" />
                <span className="truncate">{event.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchEnabled && filteredQr.length > 0 && (
          <CommandGroup heading="QR Codes">
            {filteredQr.map((qr) => (
              <CommandItem key={qr._id} onSelect={() => go('/admin/qr-codes')}>
                <QrCode className="size-4" />
                <span className="truncate">
                  {qr.eventId?.name || 'QR Code'} · {qr.uniqueCode}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchEnabled && (
          <CommandGroup heading="More">
            <CommandItem
              onSelect={() => go(`/admin/registrations?search=${encodeURIComponent(debouncedQuery)}`)}
            >
              <Search className="size-4" /> Search all registrations for &ldquo;{debouncedQuery}&rdquo;
            </CommandItem>
          </CommandGroup>
        )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default AdminSearchCommand;
