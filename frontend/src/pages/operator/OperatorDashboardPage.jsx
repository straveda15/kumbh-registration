import { CheckCircle2, XCircle, Copy, HeartPulse, PhoneCall } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/shared/StatCard';
import { useOperatorDashboard } from '@/features/operator/hooks/useOperatorDashboard';

export const OperatorDashboardPage = () => {
  const { data, isPending } = useOperatorDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Operator Dashboard</h1>
        <p className="text-sm text-muted-foreground">Today's gate-entry activity at a glance.</p>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Today's Entries" value={data?.todayEntries ?? 0} icon={CheckCircle2} />
          <StatCard title="Rejected" value={data?.rejectedEntries ?? 0} icon={XCircle} />
          <StatCard title="Duplicate Attempts" value={data?.duplicateAttempts ?? 0} icon={Copy} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl border-none p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <HeartPulse className="size-4 text-primary" /> Medical Alerts
          </h2>
          {isPending ? (
            <Skeleton className="h-24 w-full" />
          ) : data?.medicalAlerts?.length ? (
            <ul className="flex flex-col gap-3">
              {data.medicalAlerts.map((entry) => (
                <li key={entry.registrationId} className="text-xs">
                  <p className="text-foreground">{entry.conditions || 'No conditions listed'}</p>
                  {entry.allergies && <p className="text-muted-foreground">Allergies: {entry.allergies}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No medical alerts for today's entries.</p>
          )}
        </div>

        <div className="glass-card rounded-2xl border-none p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <PhoneCall className="size-4 text-primary" /> Emergency Contacts
          </h2>
          {isPending ? (
            <Skeleton className="h-24 w-full" />
          ) : data?.emergencyContacts?.length ? (
            <ul className="flex flex-col gap-3">
              {data.emergencyContacts.map((entry) => (
                <li key={entry.registrationId} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{entry.contactName || '—'}</span>
                  <span className="text-muted-foreground">{entry.phone || '—'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No emergency contacts for today's entries.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboardPage;
