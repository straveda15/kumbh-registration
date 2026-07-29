import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  RotateCcw,
  QrCode,
  PartyPopper,
  Copy,
  X,
  BadgeCheck,
  ShieldAlert,
  Check,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RegistrationNumberCard } from '@/features/dashboard/components/RegistrationNumberCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';

const DashboardSkeleton = () => (
  <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-24 w-full rounded-2xl" />
    ))}
  </div>
);

// Shown once right after submit
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

// ── 3-Step Registration Journey Stepper ──────────────────────────────────────
const JourneyStepper = ({ registrationStatus, verificationStatus }) => {
  const regKey = String(registrationStatus || 'PENDING').toLowerCase();
  const verKey = String(verificationStatus || 'PENDING').toUpperCase();

  const isRegApproved = regKey === 'approved';
  const isRegRejected = regKey === 'rejected';
  const isRegSuspect = regKey === 'suspect';

  const isVerApproved = verKey === 'APPROVED';
  const isVerRejected = verKey === 'REJECTED';

  // Connecting line 2 (Step 2 -> Step 3) color
  const line2Color = isVerApproved
    ? 'bg-green-500'
    : isVerRejected
    ? 'bg-destructive'
    : 'bg-amber-500/60';

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4">
      <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Registration Journey
      </p>

      <div className="relative flex items-center justify-between px-1 pt-1 pb-1">
        {/* Progress connecting lines */}
        <div className="absolute top-4 inset-x-6 -z-0 flex h-0.5">
          <div
            className={`w-1/2 ${
              isRegApproved
                ? 'bg-green-500'
                : isRegRejected
                ? 'bg-destructive'
                : isRegSuspect
                ? 'bg-purple-600'
                : 'bg-amber-500/60'
            }`}
          />
          <div className={`w-1/2 transition-colors duration-300 ${line2Color}`} />
        </div>

        {/* Step 1: Registration Submitted */}
        <div className="relative z-10 flex flex-col items-center gap-1 text-center max-w-[90px]">
          <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-background">
            <Check className="size-4 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-tight text-foreground">
              Registration Submitted
            </p>
            <p className="mt-0.5 text-[9.5px] font-medium text-green-600 dark:text-green-400">Completed</p>
          </div>
        </div>

        {/* Step 2: Registration Status */}
        <div className="relative z-10 flex flex-col items-center gap-1 text-center max-w-[95px]">
          {isRegApproved ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-background">
              <Check className="size-4 stroke-[2.5]" />
            </div>
          ) : isRegRejected ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm ring-4 ring-background">
              <ShieldAlert className="size-4 stroke-[2.5]" />
            </div>
          ) : isRegSuspect ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm ring-4 ring-background">
              <ShieldAlert className="size-4 stroke-[2.5]" />
            </div>
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm ring-4 ring-background">
              <Clock className="size-4 stroke-[2.5]" />
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold leading-tight text-foreground">
              Registration Status
            </p>
            {isRegApproved ? (
              <Badge variant="success" className="mt-0.5 text-[9px] px-1.5 py-0">
                Approved
              </Badge>
            ) : isRegRejected ? (
              <Badge variant="destructive" className="mt-0.5 text-[9px] px-1.5 py-0">
                Rejected
              </Badge>
            ) : isRegSuspect ? (
              <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 mt-0.5 text-[9px] px-1.5 py-0">
                Suspect
              </Badge>
            ) : (
              <Badge variant="warning" className="mt-0.5 text-[9px] px-1.5 py-0">
                Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Step 3: On-Site Identity Verification */}
        <div className="relative z-10 flex flex-col items-center gap-1 text-center max-w-[95px]">
          {isVerApproved ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-background">
              <Check className="size-4 stroke-[2.5]" />
            </div>
          ) : isVerRejected ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm ring-4 ring-background">
              <ShieldAlert className="size-4 stroke-[2.5]" />
            </div>
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm ring-4 ring-background">
              <Clock className="size-4 stroke-[2.5]" />
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold leading-tight text-foreground">
              On-Site Verification
            </p>
            {isVerApproved ? (
              <Badge variant="success" className="mt-0.5 text-[9px] px-1.5 py-0">
                Approved
              </Badge>
            ) : isVerRejected ? (
              <Badge variant="destructive" className="mt-0.5 text-[9px] px-1.5 py-0">
                Rejected
              </Badge>
            ) : (
              <Badge variant="warning" className="mt-0.5 text-[9px] px-1.5 py-0">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Rich Registration Pass Link Card ─────────────────────────────────────────
const EntryPassStatusCard = ({ registrationStatus }) => {
  const regKey = String(registrationStatus || 'PENDING').toLowerCase();

  let badgeLabel = 'Pending Review';
  let badgeVariant = 'warning';
  let badgeClass = '';
  let subtitle = 'Tap to view your registration pass.';
  let Icon = Clock;

  if (regKey === 'approved') {
    badgeLabel = 'Approved';
    badgeVariant = 'success';
    subtitle = 'Tap to view your approved registration pass.';
    Icon = BadgeCheck;
  } else if (regKey === 'rejected') {
    badgeLabel = 'Rejected';
    badgeVariant = 'destructive';
    subtitle = 'Tap to view your registration pass status.';
    Icon = ShieldAlert;
  } else if (regKey === 'suspect') {
    badgeLabel = 'Suspect';
    badgeVariant = 'outline';
    badgeClass = 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    subtitle = 'Tap to view your registration pass status.';
    Icon = ShieldAlert;
  }

  return (
    <Link
      to="/pass"
      className="glass-card group flex items-center justify-between gap-3 rounded-2xl border-none p-4 transition-all hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <QrCode className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Registration Pass
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant} className={`shrink-0 gap-1 text-[11px] ${badgeClass}`}>
          <Icon className="size-3" />
          {badgeLabel}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

// ── Dynamic Information Card ─────────────────────────────────────────────────
const VerificationInfoCard = ({ registrationStatus, rejectionReason }) => {
  const regKey = String(registrationStatus || 'PENDING').toLowerCase();

  if (regKey === 'approved') {
    return (
      <div className="glass-card flex flex-col gap-4 rounded-2xl border border-border p-4.5 bg-background/60 shadow-xs">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-green-500/15 text-green-600 dark:text-green-400">
            <BadgeCheck className="size-4.5" />
          </div>
          <h2 className="text-sm font-bold text-foreground">Registration Approved</h2>
        </div>

        {/* Short, formatted description paragraphs */}
        <div className="space-y-2 text-[13px] leading-relaxed text-muted-foreground font-normal">
          <p>Your registration has been approved successfully.</p>
          <p>On-Site Identity Verification is still pending and must be completed at the event venue.</p>
          <p>Please carry your Registration Pass and a valid Government-issued Photo ID.</p>
        </div>

        {/* Compact Info Callout */}
        <div className="flex flex-col gap-1 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-950 dark:text-amber-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Clock className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Final Step Remaining</span>
          </div>
          <p className="text-[12px] leading-normal text-amber-900/90 dark:text-amber-200/90 font-normal">
            Your registration will be fully completed only after On-Site Identity Verification at the event venue.
          </p>
        </div>

        {/* Status & Next Step Rows */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Current Status</span>
            <Badge variant="success" className="gap-1.5 text-[11px] font-semibold py-0.5 px-2">
              <span className="size-1.5 rounded-full bg-green-500" />
              Registration Approved
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Next Step</span>
            <Badge variant="warning" className="gap-1.5 text-[11px] font-semibold py-0.5 px-2">
              <span className="size-1.5 rounded-full bg-amber-500" />
              On-Site Identity Verification (Pending)
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  if (regKey === 'rejected') {
    return (
      <div className="glass-card flex flex-col gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4.5 shrink-0 text-destructive" />
          <h2 className="text-sm font-bold">Registration Rejected</h2>
        </div>
        <div className="space-y-1.5 text-xs leading-relaxed text-destructive/90">
          <p>Unfortunately, your registration request has been rejected.</p>
          <p>Please review your submitted information or contact the event help desk for further assistance.</p>
        </div>
        {rejectionReason && (
          <div className="mt-1 rounded-xl border border-destructive/30 bg-destructive/15 p-2.5 text-xs font-medium text-destructive">
            <span className="font-bold">Reason: </span>
            {rejectionReason}
          </div>
        )}
      </div>
    );
  }

  if (regKey === 'suspect') {
    return (
      <div className="glass-card flex flex-col gap-2.5 rounded-2xl border border-purple-500/25 bg-purple-500/10 p-4 text-purple-900 dark:text-purple-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4.5 shrink-0 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-bold">Registration Marked as Suspect</h2>
        </div>
        <div className="space-y-1.5 text-xs leading-relaxed text-purple-800/90 dark:text-purple-300/90">
          <p>Your registration has been flagged for additional verification and marked as suspect.</p>
          <p>Please note that your registration requires additional review. You may be contacted by the administration for further verification.</p>
        </div>
      </div>
    );
  }

  // Default: Pending
  return (
    <div className="glass-card flex flex-col gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <Clock className="size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <h2 className="text-sm font-bold">Registration Under Review</h2>
      </div>
      <div className="space-y-1.5 text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
        <p>Your registration has been submitted successfully and is currently under review.</p>
        <p>Once your registration is approved, you can proceed to the On-Site Identity Verification at the event venue.</p>
      </div>
    </div>
  );
};

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
  const registrationStatus = snapshot?.registrationStatus;
  const verificationStatus = digitalPass?.verificationStatus || 'PENDING';
  const rejectionReason = snapshot?.rejectionReason || snapshot?.statusNote;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">
          Welcome back, {personal.fullName || 'Pilgrim'}
        </h1>
      </div>

      {showSuccessBanner && location.state?.registrationNumber && (
        <RegistrationSuccessBanner
          registrationNumber={location.state.registrationNumber}
          onDismiss={() => setShowSuccessBanner(false)}
        />
      )}

      {/* 1. Registration Number Card */}
      <RegistrationNumberCard registrationNumber={snapshot?.registrationNumber} />

      {/* 2. Registration Journey Stepper */}
      <JourneyStepper
        registrationStatus={registrationStatus}
        verificationStatus={verificationStatus}
      />

      {/* 3. Rich Entry Pass Card */}
      <EntryPassStatusCard registrationStatus={registrationStatus} />

      {/* 4. Dynamic Verification Info Card */}
      <VerificationInfoCard
        registrationStatus={registrationStatus}
        rejectionReason={rejectionReason}
      />
    </div>
  );
};

export default DashboardPage;
