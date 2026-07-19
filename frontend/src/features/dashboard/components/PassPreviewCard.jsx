import { UserRound, BadgeCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

// Deliberately safe subset of the full Digital Pass (see DigitalPassCard,
// reachable at /pass): NO pilgrim ID, entry QR, internal pass ID, or
// verification QR — this card never renders a QR at all, verified or not.
// This is what a pilgrim sees on their own dashboard/pass-preview — enough
// to confirm their registration is real and where things stand.
//
// Verification is driven by `digitalPass.passActivated` (computed
// server-side in registration.service.js's getDraft from whether an
// operator has actually approved a gate scan for this pass) — NOT
// `digitalPass.status`, which is set to 'active' at submit time and never
// changes after, so it can never tell "pending" from "verified".
const VERIFICATION_META = {
  verified: { label: 'Verified', badgeVariant: 'default', icon: BadgeCheck },
  pending: { label: 'Pending On-Site Verification', badgeVariant: 'outline', icon: ShieldAlert },
  revoked: { label: 'Revoked', badgeVariant: 'destructive', icon: ShieldAlert },
};

export const PassPreviewCard = ({
  digitalPass,
  personal = {},
  accommodation = {},
  registrationStatus,
  registrationNumber,
  eventName,
  profilePhotoUrl,
}) => {
  const statusMeta = getRegistrationStatusMeta(registrationStatus);
  const isRevoked = digitalPass?.status === 'revoked';
  const isVerified = Boolean(digitalPass?.passActivated) && !isRevoked;
  const verification = isRevoked
    ? VERIFICATION_META.revoked
    : isVerified
      ? VERIFICATION_META.verified
      : VERIFICATION_META.pending;
  const VerificationIcon = verification.icon;

  return (
    <div className="glass-card overflow-hidden rounded-3xl border-none">
      <div className="bg-primary/15 px-6 py-4 text-center">
        <p className="text-xs font-medium tracking-wider text-primary uppercase">Entry Pass Preview</p>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-6">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
          {profilePhotoUrl ? (
            <img src={profilePhotoUrl} alt="Pilgrim" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8 text-muted-foreground" />
          )}
        </div>
        <p className="text-lg font-semibold text-foreground">{personal.fullName || 'Pilgrim'}</p>

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
            <span className="text-muted-foreground">Accommodation</span>
            <span className="text-right font-medium text-foreground">
              {accommodation.address || accommodation.type || '—'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
            <span className="text-muted-foreground">Registration Status</span>
            <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-2.5">
            <span className="text-muted-foreground">Verification Status</span>
            <Badge variant={verification.badgeVariant} className="gap-1">
              <VerificationIcon className="size-3" /> {verification.label}
            </Badge>
          </div>
        </div>

        {!isVerified && !isRevoked && (
          <p className="text-center text-xs text-muted-foreground">
            Your Entry Pass will become active after verification at the event.
          </p>
        )}
      </div>
    </div>
  );
};

export default PassPreviewCard;
