import { UserRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCard, DataRow } from '@/features/dashboard/components/SummaryCard';
import { useAdminProfile } from '@/features/admin/hooks/useAdminAuth';

export const OperatorProfilePage = () => {
  const { data: profile, isPending } = useAdminProfile();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your operator account details.</p>
      </div>

      <SummaryCard title="Account" icon={UserRound}>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          <>
            <DataRow label="Name" value={profile?.name} />
            <DataRow label="Email" value={profile?.email} />
            <DataRow label="Role" value={profile?.role} />
          </>
        )}
      </SummaryCard>
    </div>
  );
};

export default OperatorProfilePage;
