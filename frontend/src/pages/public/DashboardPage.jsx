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

// ── 2-Step Registration Journey Stepper ──────────────────────────────────────
const JourneyStepper = ({ verificationStatus }) => {
  const vStatus = String(verificationStatus || 'PENDING').toUpperCase();

  const isApproved = vStatus === 'APPROVED';
  const isRejected = vStatus === 'REJECTED';

  // Dynamic progress line color for step 2 segment
  const line2Color = isApproved
    ? 'bg-green-500'
    : isRejected
    ? 'bg-destructive'
    : 'bg-amber-500/60';

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4">
      <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        Registration Journey
      </p>

      <div className="relative flex items-center justify-between px-2 pt-1 pb-1">
        {/* Progress connecting lines */}
        <div className="absolute top-4 inset-x-8 -z-0 flex h-0.5">
          <div className="w-1/2 bg-green-500" />
          <div className={`w-1/2 transition-colors duration-300 ${line2Color}`} />
        </div>

        {/* Step 1: Registration Submitted */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
          <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-background">
            <Check className="size-4 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold leading-tight text-foreground">
              Registration Submitted
            </p>
            <p className="text-[10px] font-medium text-green-600 dark:text-green-400">Completed</p>
          </div>
        </div>

        {/* Step 2: Identity Verification */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
          {isApproved ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-4 ring-background">
              <Check className="size-4 stroke-[2.5]" />
            </div>
          ) : isRejected ? (
            <div className="flex size-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm ring-4 ring-background">
              <ShieldAlert className="size-4 stroke-[2.5]" />
            </div>
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm ring-4 ring-background">
              <Clock className="size-4 stroke-[2.5]" />
            </div>
          )}

          <div>
            <p className="text-[12px] font-semibold leading-tight text-foreground">
              Identity Verification
            </p>
            {isApproved ? (
              <Badge variant="success" className="mt-0.5 text-[9.5px] px-1.5 py-0">
                Verified
              </Badge>
            ) : isRejected ? (
              <Badge variant="destructive" className="mt-0.5 text-[9.5px] px-1.5 py-0">
                Rejected
              </Badge>
            ) : (
              <Badge variant="warning" className="mt-0.5 text-[9.5px] px-1.5 py-0">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Rich Entry Pass Card ─────────────────────────────────────────────────────
const EntryPassStatusCard = ({ verificationStatus }) => {
  const vStatus = String(verificationStatus || 'PENDING').toUpperCase();

  let badgeLabel = 'Pending Verification';
  let badgeVariant = 'warning';
  let subtitle = 'Tap to view your entry pass.';
  let Icon = Clock;

  if (vStatus === 'APPROVED') {
    badgeLabel = 'Verified';
    badgeVariant = 'success';
    subtitle = 'Tap to view your verified entry pass.';
    Icon = BadgeCheck;
  } else if (vStatus === 'REJECTED') {
    badgeLabel = 'Verification Required';
    badgeVariant = 'destructive';
    subtitle = 'Tap to review your registration details.';
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
            Entry Pass
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant} className="shrink-0 gap-1 text-[11px]">
          <Icon className="size-3" />
          {badgeLabel}
        </Badge>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

// ── Dynamic Information Card ─────────────────────────────────────────────────
const VerificationInfoCard = ({ verificationStatus, rejectionReason }) => {
  const vStatus = String(verificationStatus || 'PENDING').toUpperCase();

  if (vStatus === 'APPROVED') {
    return (
      <div className="glass-card flex flex-col gap-2.5 rounded-2xl border border-green-500/25 bg-green-500/10 p-4 text-green-900 dark:text-green-200">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4.5 shrink-0 text-green-600 dark:text-green-400" />
          <h2 className="text-sm font-bold">🎉 You're All Set!</h2>
        </div>
        <p className="text-xs leading-relaxed text-green-800/90 dark:text-green-300/90">
          Your identity verification has been successfully completed. Your registration is fully
          verified and you're ready to participate in the event. Please carry your Entry Pass and a
          valid government-issued photo ID when you arrive.
        </p>
        <div className="mt-1 pt-2 border-t border-green-500/20 text-[11px] font-semibold text-green-700 dark:text-green-400 flex items-center gap-3">
          <span>✓ Entry Pass Ready</span>
          <span>•</span>
          <span>✓ Identity Verified</span>
        </div>
      </div>
    );
  }

  if (vStatus === 'REJECTED') {
    return (
      <div className="glass-card flex flex-col gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4.5 shrink-0" />
          <h2 className="text-sm font-bold">Verification Requires Attention</h2>
        </div>
        <p className="text-xs leading-relaxed text-destructive/90">
          Your identity verification could not be completed. Please contact the event help desk
          before attending the event.
        </p>
        {rejectionReason && (
          <div className="mt-1 rounded-xl border border-destructive/30 bg-destructive/15 p-2.5 text-xs font-medium">
            <span className="font-bold">Reason: </span>
            {rejectionReason}
          </div>
        )}
      </div>
    );
  }

  // Default: PENDING
  return (
    <div className="glass-card flex flex-col gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <Clock className="size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <h2 className="text-sm font-bold">Verification Pending</h2>
      </div>
      <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
        Your registration has been completed successfully. The only remaining step is identity
        verification at the event venue. Please keep your Entry Pass and a valid government-issued
        photo ID ready.
      </p>
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
      <JourneyStepper verificationStatus={verificationStatus} />

      {/* 3. Rich Entry Pass Card */}
      <EntryPassStatusCard verificationStatus={verificationStatus} />

      {/* 4. Dynamic Verification Info Card */}
      <VerificationInfoCard
        verificationStatus={verificationStatus}
        rejectionReason={rejectionReason}
      />
    </div>
  );
};

export default DashboardPage;
