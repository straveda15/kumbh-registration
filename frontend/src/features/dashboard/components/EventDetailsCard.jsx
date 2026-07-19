import { CalendarDays } from 'lucide-react';
import { SummaryCard, DataRow } from './SummaryCard';
import { formatDateTime } from '@/utils/formatDate';

export const EventDetailsCard = ({ event }) => (
  <SummaryCard title="Event Details" icon={CalendarDays}>
    <DataRow label="Event" value={event?.name} />
    <DataRow label="Starts" value={event?.startDate ? formatDateTime(event.startDate) : null} />
    <DataRow label="Ends" value={event?.endDate ? formatDateTime(event.endDate) : null} />
    <DataRow label="Venue" value={event?.venue?.name} />
  </SummaryCard>
);

export default EventDetailsCard;
