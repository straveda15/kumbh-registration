import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SummaryCard } from './SummaryCard';
import { WizardProgressBar } from '@/features/registration-wizard/components/WizardProgressBar';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

export const RegistrationStatusCard = ({ registration }) => {
  const statusMeta = getRegistrationStatusMeta(registration?.registrationStatus);

  return (
    <SummaryCard
      title="Registration Status"
      icon={ClipboardCheck}
      action={<Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>}
    >
      <WizardProgressBar percentage={registration?.completionPercentage ?? 0} />
    </SummaryCard>
  );
};

export default RegistrationStatusCard;
