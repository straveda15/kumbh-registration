import { PhoneCall } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const EmergencyContactSummaryCard = ({ data = {}, className, action }) => (
  <SummaryCard title="Emergency Contacts" icon={PhoneCall} className={className} action={action}>
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-[11px] font-bold text-primary uppercase mb-1">Contact 1</p>
        <DataRow label="Contact Name" value={data.contactName} />
        <DataRow label="Relationship" value={data.relationship} />
        <DataRow label="Phone" value={data.phone} />
        <DataRow label="Alternative Phone" value={data.alternativePhone} />
      </div>

      {data.contactName2 && (
        <div className="border-t border-border/40 pt-2">
          <p className="text-[11px] font-bold text-primary uppercase mb-1">Contact 2</p>
          <DataRow label="Contact Name" value={data.contactName2} />
          <DataRow label="Relationship" value={data.relationship2} />
          <DataRow label="Phone" value={data.phone2} />
          <DataRow label="Alternative Phone" value={data.alternativePhone2} />
        </div>
      )}
    </div>
  </SummaryCard>
);

export default EmergencyContactSummaryCard;
