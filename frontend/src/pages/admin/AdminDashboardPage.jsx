import {
  Users,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileEdit,
  QrCode,
  CalendarDays,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/shared/StatCard';
import { ChartCard } from '@/features/admin/components/ChartCard';
import { RegistrationTrendChart } from '@/features/admin/components/RegistrationTrendChart';
import { ApprovalTrendChart } from '@/features/admin/components/ApprovalTrendChart';
import { GenderDistributionChart } from '@/features/admin/components/GenderDistributionChart';
import {
  useAdminOverview,
  useAdminTrend,
  useAdminRecentActivity,
} from '@/features/admin/hooks/useAdminAnalytics';
import { getActivityLabel } from '@/utils/activityLabels';
import { formatDateTime } from '@/utils/formatDate';

export const AdminDashboardPage = () => {
  const { data: overview, isPending: isOverviewPending } = useAdminOverview();
  const { data: trend, isPending: isTrendPending } = useAdminTrend(30);
  const { data: activity, isPending: isActivityPending } = useAdminRecentActivity(10);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of registrations and events.</p>
      </div>

      {isOverviewPending ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard title="Total Registrations" value={overview?.totalRegistrations ?? 0} icon={Users} />
          <StatCard title="Today's Registrations" value={overview?.todayRegistrations ?? 0} icon={CalendarDays} />
          <StatCard title="Approved" value={overview?.approved ?? 0} icon={CheckCircle2} />
          <StatCard title="Pending" value={overview?.pending ?? 0} icon={Clock} />
          <StatCard title="Rejected" value={overview?.rejected ?? 0} icon={XCircle} />
          <StatCard title="Drafts" value={overview?.drafts ?? 0} icon={FileEdit} />
          <StatCard title="QR Scans" value={overview?.totalQRScans ?? 0} icon={QrCode} />
          <StatCard title="Events" value={overview?.totalEvents ?? 0} icon={CalendarCheck} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Registration Trend (30 days)">
          {isTrendPending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <RegistrationTrendChart data={trend?.registrationTrend} />
          )}
        </ChartCard>
        <ChartCard title="Approval Trend (30 days)">
          {isTrendPending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ApprovalTrendChart data={trend?.approvalTrend} />
          )}
        </ChartCard>
        <ChartCard title="Gender Distribution">
          {isTrendPending ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <GenderDistributionChart data={trend?.genderDistribution} />
          )}
        </ChartCard>

        <div className="glass-card rounded-2xl border-none p-5">
          <h2 className="mb-3 text-sm font-medium text-foreground">Recent Activity</h2>
          {isActivityPending ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ) : activity?.length ? (
            <ul className="flex flex-col gap-3">
              {activity.map((entry) => (
                <li key={entry._id} className="flex items-start justify-between gap-3 text-xs">
                  <span className="text-foreground">{getActivityLabel(entry.action)}</span>
                  <span className="shrink-0 text-muted-foreground">{formatDateTime(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
