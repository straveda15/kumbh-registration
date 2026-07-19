import { Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { useAdminRecentActivity } from '@/features/admin/hooks/useAdminAnalytics';
import { getActivityLabel } from '@/utils/activityLabels';
import { formatDateTime } from '@/utils/formatDate';

// The backend has no separate admin-notifications feed (notifications.
// routes.js is citizen-only, gated by draft token — see backend/src/routes/
// notification.routes.js). This reuses the same recent-activity feed
// already shown in AdminTopbar's bell dropdown, just as a first-class,
// full-length page instead of only a truncated dropdown.
export const AdminNotificationsPage = () => {
  const { data: activity, isPending } = useAdminRecentActivity(50);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Recent activity across events and registrations.</p>
      </div>

      <SummaryCard title="Recent Activity" icon={Bell}>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : activity?.length ? (
          <ul className="flex flex-col gap-3">
            {activity.map((entry) => (
              <li key={entry._id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-foreground">{getActivityLabel(entry.action)}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        )}
      </SummaryCard>
    </div>
  );
};

export default AdminNotificationsPage;
