import { UserRound, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrationStatusBadge } from '@/features/admin/components/RegistrationStatusBadge';
import { SummaryCard, DataRow } from '@/features/dashboard/components/SummaryCard';
import { MedicalSummaryCard } from '@/features/dashboard/components/MedicalSummaryCard';
import { EmergencyContactSummaryCard } from '@/features/dashboard/components/EmergencyContactSummaryCard';
import { AccommodationSummaryCard } from '@/features/dashboard/components/AccommodationSummaryCard';

// Everything an operator needs to make the gate-entry call in one glance:
// identity + photo, status, medical/emergency quick-reference, and the
// duplicate-entry warning, capped by the Approve/Reject action.
export const CitizenVerificationCard = ({ verification, onApprove, onReject, isSubmitting }) => {
  const { registration, personalInformation, medicalProfile, emergencyContact, accommodation, alreadyCheckedInToday } =
    verification;
  const personal = personalInformation?.data || {};

  return (
    <div className="flex flex-col gap-4">
      {alreadyCheckedInToday && (
        <div className="glass-card flex items-center gap-3 rounded-2xl border-none border-l-4 border-l-destructive bg-destructive/10 p-4">
          <AlertTriangle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-foreground">Duplicate Entry Warning</p>
            <p className="text-xs text-muted-foreground">
              This pass already has an approved entry today. Confirm before allowing re-entry.
            </p>
          </div>
        </div>
      )}

      <SummaryCard title="Pilgrim Identity" icon={UserRound}>
        <div className="mb-2 flex items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
            <UserRound className="size-7 text-muted-foreground" />
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">{personal.fullName || 'Pilgrim'}</p>
            <RegistrationStatusBadge status={registration.registrationStatus} />
          </div>
        </div>
        <DataRow label="Registration Number" value={registration.registrationNumber} />
        <DataRow label="Pilgrim ID" value={registration.pilgrimId} />
        <DataRow label="Gender" value={personal.gender} />
        <DataRow label="Mobile" value={personal.mobile} />
      </SummaryCard>

      <MedicalSummaryCard data={medicalProfile?.data} detailed />
      <EmergencyContactSummaryCard data={emergencyContact?.data} />
      <AccommodationSummaryCard data={accommodation?.data} />

      <div className="flex gap-3">
        <Button className="flex-1 gap-1.5" disabled={isSubmitting} onClick={onApprove}>
          <Check className="size-4" /> Approve Entry
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
          disabled={isSubmitting}
          onClick={onReject}
        >
          <X className="size-4" /> Reject Entry
        </Button>
      </div>
    </div>
  );
};

export default CitizenVerificationCard;
