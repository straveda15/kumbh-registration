import { Route } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';

export const TravelSummaryCard = ({ data = {}, detailed = false, className }) => (
  <SummaryCard title="Travel Summary" icon={Route} className={className}>
    <DataRow label="Arrival" value={data.arrivalDate} />
    <DataRow label="Departure" value={data.departureDate} />
    <DataRow label="Mode" value={data.mode} />
    {detailed && (
      <>
        <DataRow label="Vehicle Number" value={data.vehicleNumber} />
        <DataRow label="Railway Station" value={data.railwayStation} />
        <DataRow label="Bus Stand" value={data.busStand} />
        <DataRow label="Expected Holy Bath Date" value={data.holyBathDate} />
      </>
    )}
  </SummaryCard>
);

export default TravelSummaryCard;
