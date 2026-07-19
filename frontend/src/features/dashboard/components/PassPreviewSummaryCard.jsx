import { Link } from 'react-router-dom';
import { IdCard, ArrowRight, BadgeCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SummaryCard } from './SummaryCard';

// Dashboard-tile counterpart to the full PassPreviewCard shown at
// /pass-preview. Same rule as that page: no entry QR code, pilgrim ID, or
// any other verification-time identifier — just enough to see status at a
// glance, matching what the full preview page reiterates in more detail.
const VERIFICATION_META = {
  verified: { label: 'Verified', badgeVariant: 'default', icon: BadgeCheck },
  pending: { label: 'Pending Verification', badgeVariant: 'outline', icon: ShieldAlert },
  revoked: { label: 'Revoked', badgeVariant: 'destructive', icon: ShieldAlert },
};

export const PassPreviewSummaryCard = ({ digitalPass }) => {
  const isRevoked = digitalPass?.status === 'revoked';
  const isVerified = Boolean(digitalPass?.passActivated) && !isRevoked;
  const verification = isRevoked
    ? VERIFICATION_META.revoked
    : isVerified
      ? VERIFICATION_META.verified
      : VERIFICATION_META.pending;
  const VerificationIcon = verification.icon;

  return (
    <SummaryCard title="Entry Pass" icon={IdCard}>
      {digitalPass ? (
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <span>Pass Number: {digitalPass.passNumber}</span>
          <Badge variant={verification.badgeVariant} className="w-fit gap-1">
            <VerificationIcon className="size-3" /> {verification.label}
          </Badge>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Your entry pass will appear here once your registration is submitted.
        </p>
      )}
      <Button asChild variant="outline" size="sm" className="mt-1 w-fit gap-1.5">
        <Link to="/pass-preview">
          View Pass Preview <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </SummaryCard>
  );
};

export default PassPreviewSummaryCard;
