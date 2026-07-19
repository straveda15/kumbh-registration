import { BedDouble } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const AccommodationSummaryCard = ({ data = {}, className }) => (
  <SummaryCard title="Accommodation Summary" icon={BedDouble} className={className}>
    <DataRow label="Type" value={data.type} />
    <DataRow label="Address" value={data.address} />
  </SummaryCard>
);

export default AccommodationSummaryCard;
