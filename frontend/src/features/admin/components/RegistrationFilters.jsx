import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGISTRATION_STATUS_META, getRegistrationStatusMeta } from '@/utils/registrationStatus';

const STATUS_VALUES = Object.keys(REGISTRATION_STATUS_META);

export const RegistrationFilters = ({ filters, onChange }) => {
  const update = (patch) => onChange({ ...filters, ...patch, page: '1' });

  return (
    <div className="glass-card flex flex-wrap items-end gap-3 rounded-2xl border-none p-4">
      <div className="flex min-w-48 flex-1 flex-col gap-1.5">
        <Label className="text-xs">Search</Label>
        <Input
          value={filters.search || ''}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Name, registration number, pilgrim ID…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Status</Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => update({ status: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-40">
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

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Gender</Label>
        <Select
          value={filters.gender || 'all'}
          onValueChange={(value) => update({ gender: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-32">
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
          className="w-32"
          value={filters.state || ''}
          onChange={(event) => update({ state: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">District</Label>
        <Input
          className="w-32"
          value={filters.district || ''}
          onChange={(event) => update({ district: event.target.value })}
        />
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

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange({})}
        className="gap-1.5 text-muted-foreground"
      >
        <X className="size-3.5" /> Clear
      </Button>
    </div>
  );
};

export default RegistrationFilters;
