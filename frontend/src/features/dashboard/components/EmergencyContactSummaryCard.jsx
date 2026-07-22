import { PhoneCall } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const EmergencyContactSummaryCard = ({ data = {}, className, action }) => (
  <SummaryCard title="Emergency Contact" icon={PhoneCall} className={className} action={action}>
    <DataRow label="Contact Name" value={data.contactName} />
    <DataRow label="Relationship" value={data.relationship} />
    <DataRow label="Phone" value={data.phone} />
    <DataRow label="Alternative Phone" value={data.alternativePhone} />
  </SummaryCard>
);

export default EmergencyContactSummaryCard;
