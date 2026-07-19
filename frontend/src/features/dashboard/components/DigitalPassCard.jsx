import { forwardRef } from 'react';
import { UserRound, BadgeCheck, ShieldAlert, Lock, IdCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

// Pass-level verification is a distinct concept from registration approval:
// an admin approving a registration and an operator verifying identity at
// the gate are two different steps. `digitalPass.passActivated` (computed
// server-side in registration.service.js's getDraft, from whether an
// approved ScanLog entry exists for this pass) is the real signal for
// on-site verification — NOT DigitalPass.status, which is set to 'active'
// at submit time and never changes after that (unrelated to the gate).
// The backend only sends the real qrCode/qrImage once passActivated is
// true; before that they're null, so this component never has the QR to
// leak even if it wanted to.
const VERIFICATION_META = {
  verified: { label: 'Verified', badgeVariant: 'default', icon: BadgeCheck },
  pending: { label: 'Pending On-Site Verification', badgeVariant: 'outline', icon: ShieldAlert },
  revoked: { label: 'Revoked', badgeVariant: 'destructive', icon: ShieldAlert },
};

// The pass visual itself, extracted so both the citizen DigitalPassPage and
// the admin Registration Detail's Digital Pass tab render identically
// instead of duplicating this markup. Forwards a ref so callers can pass
// the node straight into utils/generatePassPdf.js.
export const DigitalPassCard = forwardRef(
  (
    {
      digitalPass,
      personal = {},
      accommodation = {},
      registrationStatus,
      registrationNumber,
      eventName,
      profilePhotoUrl,
    },
    ref
  ) => {
    const statusMeta = getRegistrationStatusMeta(registrationStatus);
    const isRevoked = digitalPass?.status === 'revoked';
    // Two separate questions: whether there's a real QR to render at all
    // (the backend only includes qrImage for the citizen once verified —
    // see getDraft — but never redacts it for admin, who should keep
    // seeing the real code regardless of verification state) and whether
    // the pilgrim has actually been verified (drives the badge/banner for
    // both views identically).
    const hasQrImage = Boolean(digitalPass?.qrImage);
    const isVerified = Boolean(digitalPass?.passActivated) && !isRevoked;
    const verification = isRevoked
      ? VERIFICATION_META.revoked
      : isVerified
        ? VERIFICATION_META.verified
        : VERIFICATION_META.pending;
    const VerificationIcon = verification.icon;

    return (
      <div ref={ref} className="glass-card overflow-hidden rounded-3xl border-none">
        <div className="bg-primary/15 px-6 py-4 text-center">
          <p className="text-xs font-medium tracking-wider text-primary uppercase">
            Kumbh Registration Pass
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="Pilgrim" className="size-full object-cover" />
            ) : (
              <UserRound className="size-10 text-muted-foreground" />
            )}
            {isVerified && (
              <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                <BadgeCheck className="size-4" />
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-foreground">{personal.fullName || 'Pilgrim'}</p>

          {hasQrImage ? (
            <img
              src={digitalPass.qrImage}
              alt="Digital pass QR code"
              className="size-40 rounded-xl bg-white p-2"
            />
          ) : (
            // The QR is confidential until on-site verification — this
            // placeholder is shown instead, never the real code, matching
            // what the backend actually sends (qrImage is null until then).
            <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/10 text-muted-foreground">
                <Lock className="size-5" />
              </span>
              <p className="text-sm font-medium text-foreground">Entry QR Code</p>
              <p className="text-xs text-muted-foreground">
                Your entry QR code is securely stored. It will be available only after identity
                verification at the event.
              </p>
              <p className="text-xs text-muted-foreground">
                Please carry your Registration Number and a valid Government ID.
              </p>
            </div>
          )}

          <div className="flex w-full flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-muted-foreground">Registration No.</span>
              <span className="font-mono font-medium text-foreground">{registrationNumber || '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium text-foreground">{eventName || '—'}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-muted-foreground">Registration Status</span>
              <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-muted-foreground">Verification</span>
              <Badge variant={verification.badgeVariant} className="gap-1">
                <VerificationIcon className="size-3" /> {verification.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-muted-foreground">Accommodation</span>
              <span className="text-right font-medium text-foreground">
                {accommodation.address || accommodation.type || '—'}
              </span>
            </div>
          </div>

          {!isVerified && !isRevoked && (
            <div className="flex w-full flex-col gap-2 rounded-xl bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              <p className="flex items-center gap-1.5 font-medium">
                <IdCard className="size-3.5" /> Important
              </p>
              <p>
                Please carry a valid government-issued ID. Your entry QR code will be activated
                after identity verification at the event.
              </p>
            </div>
          )}
        </div>

        {!isVerified && (
          <div className="border-t border-white/10 bg-destructive/10 px-6 py-3 text-center">
            <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
              {isRevoked ? 'Entry Pass Revoked' : 'Entry Pass Not Yet Activated'}
            </p>
          </div>
        )}
      </div>
    );
  }
);

DigitalPassCard.displayName = 'DigitalPassCard';

export default DigitalPassCard;
