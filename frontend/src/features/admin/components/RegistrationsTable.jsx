import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Eye,
  Check,
  X,
  Trash2,
  IdCard,
  Printer,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Columns3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { RegistrationStatusBadge } from './RegistrationStatusBadge';
import { formatDateTime } from '@/utils/formatDate';

const SORTABLE_COLUMNS = new Set(['submittedAt', 'registrationNumber']);

export const RegistrationsTable = ({
  registrations,
  meta,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onView,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [columnVisibility, setColumnVisibility] = useState({});

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.personal?.data?.fullName || '—'}
          </span>
        ),
      },
      {
        id: 'registrationNumber',
        header: 'Registration Number',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.registrationNumber || '—'}</span>
        ),
      },
      {
        id: 'pilgrimId',
        header: 'Pilgrim ID',
        meta: { tabletHidden: true },
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.pilgrimId || '—'}</span>,
      },
      {
        id: 'mobile',
        header: 'Mobile',
        cell: ({ row }) => row.original.personal?.data?.mobile || '—',
      },
      {
        id: 'event',
        header: 'Event',
        cell: ({ row }) => row.original.eventId?.name || '—',
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <RegistrationStatusBadge status={row.original.registrationStatus} />,
      },
      {
        id: 'qrStatus',
        header: 'QR Status',
        meta: { tabletHidden: true },
        cell: ({ row }) => (
          <span className="text-xs capitalize text-muted-foreground">
            {row.original.qrId?.status || '—'}
          </span>
        ),
      },
      {
        id: 'gender',
        header: 'Gender',
        meta: { tabletHidden: true },
        cell: ({ row }) => (
          <span className="capitalize">{row.original.personal?.data?.gender || '—'}</span>
        ),
      },
      {
        id: 'state',
        header: 'State',
        cell: ({ row }) => row.original.personal?.data?.state || '—',
      },
      {
        id: 'submittedAt',
        header: 'Submitted',
        cell: ({ row }) =>
          row.original.submittedAt ? formatDateTime(row.original.submittedAt) : '—',
      },
      {
        id: 'actions',
        header: '',
        enableHiding: false,
        cell: ({ row }) => {
          const registration = row.original;
          const canApprove = registration.registrationStatus === 'submitted';
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Row actions">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(registration._id)}>
                  <Eye className="size-4" /> View
                </DropdownMenuItem>
                {canApprove && (
                  <>
                    <DropdownMenuItem onClick={() => onApprove(registration._id)}>
                      <Check className="size-4" /> Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReject(registration._id)}>
                      <X className="size-4" /> Reject
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to={`/admin/registrations/${registration._id}?tab=pass`}>
                    <IdCard className="size-4" /> Download Pass
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/admin/registrations/${registration._id}?tab=pass&print=1`}>
                    <Printer className="size-4" /> Print Pass
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(registration._id)}
                >
                  <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onView, onApprove, onReject, onDelete]
  );

  const table = useReactTable({
    data: registrations,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
  });

  const handleSort = (columnId) => {
    if (!SORTABLE_COLUMNS.has(columnId)) return;
    if (sortBy !== columnId) {
      onSortChange(columnId, 'desc');
    } else {
      onSortChange(columnId, sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden justify-end md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Columns3 className="size-3.5" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllLeafColumns()
              .filter((column) => column.columnDef.enableHiding !== false)
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile: one tappable card per registration instead of a
          horizontally-scrolling table — no dropdown-hidden actions, the two
          that matter (View Details, and Approve/Reject while submitted)
          are always visible and thumb-sized. */}
      <div className="flex flex-col gap-3 md:hidden">
        {registrations.length === 0 ? (
          <div className="glass-card rounded-2xl border-none p-8 text-center text-sm text-muted-foreground">
            No registrations match these filters.
          </div>
        ) : (
          registrations.map((registration) => {
            const canApprove = registration.registrationStatus === 'submitted';
            return (
              <div key={registration._id} className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate font-semibold text-foreground">
                    {registration.personal?.data?.fullName || '—'}
                  </p>
                  <RegistrationStatusBadge status={registration.registrationStatus} />
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
                  <div>
                    <p className="text-muted-foreground">Registration No</p>
                    <p className="font-mono font-medium text-foreground">
                      {registration.registrationNumber || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mobile</p>
                    <p className="font-medium text-foreground">{registration.personal?.data?.mobile || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">State</p>
                    <p className="font-medium text-foreground">{registration.personal?.data?.state || '—'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground">Event</p>
                    <p className="truncate font-medium text-foreground">{registration.eventId?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">
                      {registration.submittedAt ? formatDateTime(registration.submittedAt) : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 flex-1 gap-1.5"
                    onClick={() => onView(registration._id)}
                  >
                    <Eye className="size-3.5" /> View Details
                  </Button>
                  {canApprove && (
                    <>
                      <Button size="sm" className="h-9 flex-1 gap-1.5" onClick={() => onApprove(registration._id)}>
                        <Check className="size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 flex-1 gap-1.5"
                        onClick={() => onReject(registration._id)}
                      >
                        <X className="size-3.5" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="glass-card hidden overflow-x-auto rounded-2xl border-none md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.tabletHidden ? 'hidden lg:table-cell' : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={() => handleSort(header.column.id)}
                        className={
                          SORTABLE_COLUMNS.has(header.column.id)
                            ? 'inline-flex items-center gap-1 hover:text-foreground'
                            : 'inline-flex items-center gap-1'
                        }
                        disabled={!SORTABLE_COLUMNS.has(header.column.id)}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortBy === header.column.id &&
                          (sortOrder === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          ))}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.tabletHidden ? 'hidden lg:table-cell' : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                  No registrations match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
              className="gap-1"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
              className="gap-1"
            >
              Next <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsTable;
