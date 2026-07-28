import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { RotateCcw, QrCode, PartyPopper, Copy, X, BadgeCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RegistrationNumberCard } from '@/features/dashboard/components/RegistrationNumberCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';

const DashboardSkeleton = () => (
  <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="h-20 w-full rounded-2xl" />
    ))}
  </div>
);

const ENTRY_PASS_META = {
  verified: { label: 'Verified', variant: 'default', icon: BadgeCheck },
  approved: { label: 'Approved', variant: 'success', icon: BadgeCheck },
  pending: { label: 'Pending Verification', variant: 'warning', icon: ShieldAlert },
  rejected: { label: 'Rejected', variant: 'destructive', icon: ShieldAlert },
  revoked: { label: 'Revoked', variant: 'destructive', icon: ShieldAlert },
  none: { label: 'Not Generated', variant: 'outline', icon: ShieldAlert },
};

// Shown exactly once, right after submit — ReviewStep navigates here with
// this in route state (not persisted anywhere), so a reload or any later
// visit to /dashboard never re-shows it.
const RegistrationSuccessBanner = ({ registrationNumber, onDismiss }) => (
  <div className="glass-card flex flex-col items-start gap-3 rounded-2xl border-none p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <PartyPopper className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">Registration completed successfully.</p>
        <p className="text-xs text-muted-foreground">Your Registration Number has been generated.</p>
      </div>
    </div>
    <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 flex-1 gap-1.5 sm:flex-none"
        onClick={() => {
          navigator.clipboard?.writeText(registrationNumber);
          toast.success('Registration Number copied');
        }}
      >
        <Copy className="size-3.5" /> Copy
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" onClick={onDismiss} aria-label="Dismiss">
        <X className="size-4" />
      </Button>
    </div>
  </div>
);

export const DashboardPage = () => {
  const location = useLocation();
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const [showSuccessBanner, setShowSuccessBanner] = useState(Boolean(location.state?.justRegistered));

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
        <QrCode className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">No registration found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find a registration in this browser. Use your registration link (or scan
          your QR code again) to view your dashboard.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-base font-medium text-foreground">Couldn't load your dashboard</p>
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const personal = snapshot?.personalInformation?.data ?? {};
  const digitalPass = snapshot?.digitalPass;
  const regStatus = (snapshot?.registrationStatus || 'submitted').toLowerCase();
  const rejectionReason = snapshot?.rejectionReason || snapshot?.statusNote;

  let passMeta = ENTRY_PASS_META.pending;
  if (regStatus === 'approved') {
    passMeta = ENTRY_PASS_META.approved;
  } else if (regStatus === 'rejected') {
    passMeta = ENTRY_PASS_META.rejected;
  } else if (regStatus === 'draft' && !snapshot?.registrationNumber) {
    passMeta = ENTRY_PASS_META.none;
  } else if (digitalPass?.status === 'revoked') {
    passMeta = ENTRY_PASS_META.revoked;
  }

  const PassIcon = passMeta.icon;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          Welcome back, {personal.fullName || 'Pilgrim'}
        </h1>
      </div>

      {showSuccessBanner && location.state?.registrationNumber && (
        <RegistrationSuccessBanner
          registrationNumber={location.state.registrationNumber}
          onDismiss={() => setShowSuccessBanner(false)}
        />
      )}

      <RegistrationNumberCard registrationNumber={snapshot?.registrationNumber} />

      {regStatus === 'rejected' && (
        <div className="glass-card flex flex-col items-start gap-1.5 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <ShieldAlert className="size-4 shrink-0" />
            <span>Registration Rejected</span>
          </div>
          <p className="text-xs text-destructive/90">
            {rejectionReason
              ? `Reason: ${rejectionReason}`
              : 'Your registration was rejected by the admin team.'}
          </p>
        </div>
      )}

      <Link
        to="/pass"
        className="glass-card flex items-center justify-between gap-3 rounded-2xl border-none p-4"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">Entry Pass Status</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Tap to view your entry pass</p>
        </div>
        <Badge variant={passMeta.variant} className="shrink-0 gap-1">
          <PassIcon className="size-3" /> {passMeta.label}
        </Badge>
      </Link>
    </div>
  );
};

export default DashboardPage;
