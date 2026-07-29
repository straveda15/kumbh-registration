import { BedDouble } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const AccommodationSummaryCard = ({ data = {}, className, action }) => (
  <SummaryCard title="Accommodation Summary" icon={BedDouble} className={className} action={action}>
    <DataRow label="Type" value={data.type} />
    <DataRow label="Address" value={data.address} />
    {data.expectedArrivalDate && <DataRow label="Expected Arrival Date" value={data.expectedArrivalDate} />}
    {data.expectedDepartureDate && <DataRow label="Expected Departure Date" value={data.expectedDepartureDate} />}
  </SummaryCard>
);

export default AccommodationSummaryCard;
