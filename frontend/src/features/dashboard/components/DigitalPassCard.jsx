import { forwardRef } from 'react';
import { UserRound, BadgeCheck, ShieldAlert, Lock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';
import { cn } from '@/lib/utils';

const getVerificationBadgeMeta = (status) => {
  const s = String(status || '').trim().toUpperCase();
  if (s === 'APPROVED') {
    return { badgeVariant: 'success', icon: BadgeCheck };
  }
  if (s === 'REJECTED') {
    return { badgeVariant: 'destructive', icon: ShieldAlert };
  }
  return { badgeVariant: 'warning', icon: ShieldAlert };
};

// ── Shared row style ───────────────────────────────────────────────────────
const ROW = 'flex h-9 items-center justify-between gap-3 px-4';
const LABEL = 'shrink-0 text-[12px] leading-none text-muted-foreground';
const VALUE = 'text-right text-[12px] font-medium leading-none text-foreground';

export const DigitalPassCard = forwardRef(
  (
    {
      digitalPass,
      personal        = {},
      accommodation   = {},
      registrationStatus,
      registrationNumber,
      hideRegistrationNumber = false,
      eventName,
      profilePhotoUrl,
      rejectionReason,
    },
    ref
  ) => {
    // ── Derived state ──────────────────────────────────────────────────────
    const statusMeta = getRegistrationStatusMeta(registrationStatus);
    const rawVerificationStatus = digitalPass?.verificationStatus || 'PENDING';
    const verificationMeta = getVerificationBadgeMeta(rawVerificationStatus);
    const VerificationIcon = verificationMeta.icon;

    const isRevoked = digitalPass?.status === 'revoked';
    const isRejected = String(rawVerificationStatus).toUpperCase() === 'REJECTED';
    const isApproved = String(rawVerificationStatus).toUpperCase() === 'APPROVED';
    const hasQrImage = Boolean(digitalPass?.qrImage);
    const isVerified = (isApproved || Boolean(digitalPass?.passActivated)) && !isRevoked && !isRejected;

    const hasAccommodation = accommodation.address || accommodation.type;

    return (
      <div ref={ref} className="glass-card overflow-hidden rounded-2xl border-none">
        {/* ════ HEADER ════ */}
        <div className="flex items-center justify-center bg-primary/15 px-4 py-2">
          <p className="text-[10px] font-extrabold tracking-[0.22em] text-primary uppercase">
            Kumbh Registration Pass
          </p>
        </div>

        {/* ════ HERO: avatar → name ════ */}
        <div className="flex flex-col items-center gap-1.5 px-4 pt-4 pb-3">
          {/* Avatar */}
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5 ring-2 ring-white/12">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="Pilgrim" className="size-full object-cover" />
            ) : (
              <UserRound className="size-7 text-muted-foreground" />
            )}
            {isVerified && (
              <span className="absolute right-0 bottom-0 flex size-[18px] items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                <BadgeCheck className="size-3" />
              </span>
            )}
          </div>

          {/* Name */}
          <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
            {personal.fullName || 'Pilgrim'}
          </p>
        </div>

        {/* ════ DIVIDER ════ */}
        <div className="mx-4 h-px bg-white/8" />

        {/* ════ QR SECTION ════ */}
        <div className="flex items-center justify-center px-4 py-4">
          {hasQrImage ? (
            <img
              src={digitalPass.qrImage}
              alt="Entry pass QR code"
              className="size-[160px] rounded-xl bg-white p-2 shadow"
            />
          ) : (
            /* ── Locked QR placeholder ── */
            <div className="relative size-[160px] shrink-0 overflow-hidden rounded-xl border border-border/25 bg-muted/15 shadow-inner">
              {/* Simulated QR tiles — blurred background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 grid grid-cols-7 gap-[2.5px] p-2.5 opacity-[0.12] blur-[3px] select-none"
              >
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-[1.5px]',
                      (i < 7 && (i < 3 || i > 3))           ? 'bg-foreground' :
                      (i >= 42 && (i < 46 || i > 46))       ? 'bg-foreground' :
                      (i % 7 === 0 && i < 21)                ? 'bg-foreground' :
                      (i % 7 === 6 && i < 21)                ? 'bg-foreground' :
                      (i * 5 + 2) % 7 === 0                  ? 'bg-foreground' :
                      (i * 3 + 1) % 5 === 0                  ? 'bg-foreground' :
                                                               'bg-transparent'
                    )}
                  />
                ))}
              </div>

              {/* Frosted overlay + lock */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/58 backdrop-blur-[6px]">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 shadow-sm">
                  <Lock className="size-4.5" />
                </span>
                <span className="text-[8.5px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                  Protected
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ════ DIVIDER ════ */}
        <div className="mx-4 h-px bg-white/8" />

        {/* ════ INFO ROWS ════ */}
        <div className="flex flex-col divide-y divide-white/7">
          {!hideRegistrationNumber && registrationNumber && (
            <div className={ROW}>
              <span className={LABEL}>Registration No.</span>
              <span className={cn(VALUE, 'font-mono')}>{registrationNumber}</span>
            </div>
          )}

          <div className={ROW}>
            <span className={LABEL}>Event</span>
            <span className={cn(VALUE, 'max-w-[55%] truncate')}>{eventName || '—'}</span>
          </div>

          <div className={ROW}>
            <span className={LABEL}>Registration Status</span>
            <Badge variant={statusMeta.badgeVariant} className="shrink-0 text-[10.5px]">
              {statusMeta.label}
            </Badge>
          </div>

          <div className={ROW}>
            <span className={LABEL}>Verification</span>
            <Badge variant={verificationMeta.badgeVariant} className="shrink-0 gap-1 text-[10.5px]">
              <VerificationIcon className="size-2.5 shrink-0" />
              {rawVerificationStatus}
            </Badge>
          </div>

          {hasAccommodation && (
            <div className={ROW}>
              <span className={LABEL}>Accommodation</span>
              <span className={cn(VALUE, 'max-w-[55%] truncate')}>
                {accommodation.address || accommodation.type}
              </span>
            </div>
          )}
        </div>

        {/* ════ DYNAMIC ACTIVATION BANNER ════ */}
        {isApproved ? (
          <div className="mt-0 border-t border-green-500/20 bg-green-500/10 px-5 py-2.5 text-center">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-green-600 dark:text-green-400 uppercase">
              ENTRY PASS ACTIVE
            </p>
            <div className="mt-1 inline-flex items-center justify-center gap-1.5 text-[9.5px] leading-tight text-muted-foreground">
              <Info className="size-2.5 shrink-0 text-green-600 dark:text-green-400" />
              <span>Your QR Code is active and ready for event entry.</span>
            </div>
          </div>
        ) : isRejected ? (
          <div className="mt-0 border-t border-destructive/20 bg-destructive/10 px-5 py-2.5 text-center">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-destructive uppercase">
              ENTRY PASS UNAVAILABLE
            </p>
            <div className="mt-1 inline-flex items-center justify-center gap-1.5 text-[9.5px] leading-tight text-muted-foreground">
              <Info className="size-2.5 shrink-0 text-destructive" />
              <span>Your Entry Pass cannot be activated until verification is successfully completed.</span>
            </div>
            {rejectionReason && (
              <div className="mt-1.5 w-full rounded-lg bg-destructive/15 p-2 text-[9.5px] font-medium text-destructive">
                Reason: {rejectionReason}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-0 border-t border-destructive/20 bg-destructive/10 px-5 py-2.5 text-center">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-destructive uppercase">
              ENTRY PASS NOT YET ACTIVATED
            </p>
            <div className="mt-1 inline-flex items-center justify-center gap-1.5 text-[9.5px] leading-tight text-muted-foreground">
              <Info className="size-2.5 shrink-0 text-muted-foreground" />
              <span>QR Code available after on-site identity verification.</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DigitalPassCard.displayName = 'DigitalPassCard';

export default DigitalPassCard;
