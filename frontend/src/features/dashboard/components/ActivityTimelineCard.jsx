import { History } from 'lucide-react';
import { SummaryCard } from './SummaryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/utils/formatDate';
import { getActivityLabel } from '@/utils/activityLabels';

export const ActivityTimelineCard = ({ activity, isLoading }) => (
  <SummaryCard title="Registration Timeline" icon={History}>
    {isLoading ? (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    ) : activity?.length ? (
      <ul className="flex flex-col gap-3">
        {activity.slice(0, 8).map((entry) => (
          <li key={entry._id} className="flex items-start justify-between gap-3 text-xs">
            <span className="text-foreground">{getActivityLabel(entry.action)}</span>
            <span className="shrink-0 text-muted-foreground">{formatDateTime(entry.createdAt)}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-muted-foreground">No activity yet.</p>
    )}
  </SummaryCard>
);

export default ActivityTimelineCard;
