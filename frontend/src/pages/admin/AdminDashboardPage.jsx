import {
  Users,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/shared/StatCard';
import { ChartCard } from '@/features/admin/components/ChartCard';
import { RegistrationTrendChart } from '@/features/admin/components/RegistrationTrendChart';
import { DailyRegistrationsChart } from '@/features/admin/components/DailyRegistrationsChart';
import { MonthlyRegistrationsChart } from '@/features/admin/components/MonthlyRegistrationsChart';
import { RegistrationStatusChart } from '@/features/admin/components/RegistrationStatusChart';
import { GenderDistributionChart } from '@/features/admin/components/GenderDistributionChart';
import { DistrictDistributionChart } from '@/features/admin/components/DistrictDistributionChart';
import { ApprovalTrendChart } from '@/features/admin/components/ApprovalTrendChart';
import { useAdminOverview, useAdminTrend } from '@/features/admin/hooks/useAdminAnalytics';

export const AdminDashboardPage = () => {
  const { data: overview, isPending: isOverviewPending } = useAdminOverview();
  // Three separate windows of the same real per-day data, each answering a
  // different question rather than showing the same chart three times:
  // 14 days for recent daily volume, 30 for the broader trend direction
  // (also the source of gender/district distribution, which aren't
  // date-scoped so any window works), 365 rolled up into months.
  const { data: trend14, isPending: isTrend14Pending } = useAdminTrend(14);
  const { data: trend30, isPending: isTrend30Pending } = useAdminTrend(30);
  const { data: trend365, isPending: isTrend365Pending } = useAdminTrend(365);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of registrations and events.</p>
      </div>

      {isOverviewPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Registrations" value={overview?.totalRegistrations ?? 0} icon={Users} tone="blue" />
          <StatCard title="Pending Approvals" value={overview?.pending ?? 0} icon={Clock} tone="amber" />
          <StatCard title="Approved" value={overview?.approved ?? 0} icon={CheckCircle2} tone="green" />
          <StatCard title="Rejected" value={overview?.rejected ?? 0} icon={XCircle} tone="red" />
          <StatCard title="QR Scans" value={overview?.totalQRScans ?? 0} icon={QrCode} tone="purple" />
          <StatCard title="Events" value={overview?.totalEvents ?? 0} icon={CalendarCheck} tone="blue" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Registration Trend (30 days)">
          {isTrend30Pending ? <Skeleton className="h-full w-full" /> : <RegistrationTrendChart data={trend30?.registrationTrend} />}
        </ChartCard>
        <ChartCard title="Daily Registrations (14 days)">
          {isTrend14Pending ? <Skeleton className="h-full w-full" /> : <DailyRegistrationsChart data={trend14?.registrationTrend} />}
        </ChartCard>
        <ChartCard title="Monthly Registrations">
          {isTrend365Pending ? <Skeleton className="h-full w-full" /> : <MonthlyRegistrationsChart data={trend365?.registrationTrend} />}
        </ChartCard>

        <ChartCard title="Registration Status">
          {isOverviewPending ? <Skeleton className="h-full w-full" /> : <RegistrationStatusChart overview={overview} />}
        </ChartCard>
        <ChartCard title="Gender Distribution">
          {isTrend30Pending ? <Skeleton className="h-full w-full" /> : <GenderDistributionChart data={trend30?.genderDistribution} />}
        </ChartCard>
        <ChartCard title="District-wise Registrations">
          {isTrend30Pending ? <Skeleton className="h-full w-full" /> : <DistrictDistributionChart data={trend30?.districtDistribution} />}
        </ChartCard>

        <ChartCard title="Approval Trend (30 days)" className="md:col-span-2 xl:col-span-1">
          {isTrend30Pending ? <Skeleton className="h-full w-full" /> : <ApprovalTrendChart data={trend30?.approvalTrend} />}
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
