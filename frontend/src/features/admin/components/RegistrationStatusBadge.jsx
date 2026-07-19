import { Badge } from '@/components/ui/badge';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

export const RegistrationStatusBadge = ({ status }) => {
  const meta = getRegistrationStatusMeta(status);
  return <Badge variant={meta.badgeVariant}>{meta.label}</Badge>;
};

export default RegistrationStatusBadge;
