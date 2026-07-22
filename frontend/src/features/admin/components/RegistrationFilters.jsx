import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGISTRATION_STATUS_META, getRegistrationStatusMeta } from '@/utils/registrationStatus';

// 'draft' is deliberately excluded — the Registration page (and this
// filter bar) only ever shows completed/submitted pilgrims, and the
// backend's listRegistrations ignores a draft status filter outright, so
// offering it here would just be a dead-end option.
const STATUS_VALUES = Object.keys(REGISTRATION_STATUS_META).filter((status) => status !== 'draft');

const FILTER_KEYS = ['status', 'gender', 'state', 'district', 'dateFrom', 'dateTo'];

export const RegistrationFilters = ({ filters, onChange, hideStatus = false }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const update = (patch) => onChange({ ...filters, ...patch, page: '1' });
  const activeCount = FILTER_KEYS.filter((key) => filters[key]).length;

  const fields = (
    <>
      {!hideStatus && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => update({ status: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_VALUES.map((status) => (
                <SelectItem key={status} value={status}>
                  {getRegistrationStatusMeta(status).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Gender</Label>
        <Select
          value={filters.gender || 'all'}
          onValueChange={(value) => update({ gender: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">State</Label>
        <Input
          className="w-full sm:w-32"
          value={filters.state || ''}
          onChange={(event) => update({ state: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">District</Label>
        <Input
          className="w-full sm:w-32"
          value={filters.district || ''}
          onChange={(event) => update({ district: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">From</Label>
        <Input
          type="date"
          className="w-full sm:w-40"
          value={filters.dateFrom || ''}
          onChange={(event) => update({ dateFrom: event.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">To</Label>
        <Input
          type="date"
          className="w-full sm:w-40"
          value={filters.dateTo || ''}
          onChange={(event) => update({ dateTo: event.target.value })}
        />
      </div>
    </>
  );

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex w-full flex-1 flex-col gap-1.5 sm:min-w-48 sm:w-auto">
        <Label className="text-xs">Search</Label>
        <div className="flex gap-2">
          <Input
            value={filters.search || ''}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Name, registration number, pilgrim ID…"
            className="flex-1"
          />
          {/* On desktop the rest of the filters already sit inline to the
              right, so this trigger is mobile/tablet only — the same
              fields open in a bottom drawer instead of being crammed into
              the row or forcing horizontal scroll. */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative shrink-0 sm:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4" />
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="hidden flex-wrap items-end gap-3 sm:flex">
        {fields}
        <Button variant="ghost" size="sm" onClick={() => onChange({})} className="gap-1.5 text-muted-foreground">
          <X className="size-3.5" /> Clear
        </Button>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl sm:hidden">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4">{fields}</div>
          <SheetFooter className="flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-1.5"
              onClick={() => {
                onChange({});
                setDrawerOpen(false);
              }}
            >
              <X className="size-3.5" /> Clear
            </Button>
            <Button type="button" className="h-11 flex-1" onClick={() => setDrawerOpen(false)}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RegistrationFilters;
