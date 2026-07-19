import { Link } from 'react-router-dom';
import { RotateCcw, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RegistrationStatusCard } from '@/features/dashboard/components/RegistrationStatusCard';
import { PassPreviewSummaryCard } from '@/features/dashboard/components/PassPreviewSummaryCard';
import { EventDetailsCard } from '@/features/dashboard/components/EventDetailsCard';
import { ProfileSummaryCard } from '@/features/dashboard/components/ProfileSummaryCard';
import { MedicalSummaryCard } from '@/features/dashboard/components/MedicalSummaryCard';
import { TravelSummaryCard } from '@/features/dashboard/components/TravelSummaryCard';
import { AccommodationSummaryCard } from '@/features/dashboard/components/AccommodationSummaryCard';
import { FamilyMembersCard } from '@/features/dashboard/components/FamilyMembersCard';
import { DocumentsSummaryCard } from '@/features/dashboard/components/DocumentsSummaryCard';
import { ActivityTimelineCard } from '@/features/dashboard/components/ActivityTimelineCard';
import { NotificationsCard } from '@/features/dashboard/components/NotificationsCard';
import { QuickActionsCard } from '@/features/dashboard/components/QuickActionsCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useActivity } from '@/features/dashboard/hooks/useActivity';
import { useNotifications } from '@/features/dashboard/hooks/useNotifications';
import { useDocuments } from '@/features/documents/hooks/useDocuments';

const DashboardSkeleton = () => (
  <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-48 w-full rounded-2xl" />
    ))}
  </div>
);

export const DashboardPage = () => {
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: activity, isLoading: isActivityLoading } = useActivity();
  const { data: notifications, isLoading: isNotificationsLoading } = useNotifications();
  const { data: documents, isLoading: isDocumentsLoading } = useDocuments();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
        <QrCode className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold text-foreground">No registration found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find a registration in this browser. Use your registration link (or scan
          your QR code again) to view your dashboard.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-base font-medium text-foreground">Couldn't load your dashboard</p>
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const personal = snapshot?.personalInformation?.data ?? {};

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {personal.fullName || 'Pilgrim'}
        </h1>
        <p className="text-sm text-muted-foreground">Here's an overview of your registration.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <RegistrationStatusCard registration={snapshot} />
        <ProfileSummaryCard data={personal} />
        <EventDetailsCard event={snapshot?.event} />
        <PassPreviewSummaryCard digitalPass={snapshot?.digitalPass} />
        <MedicalSummaryCard data={snapshot?.medicalProfile?.data} />
        <TravelSummaryCard data={snapshot?.travelInformation?.data} />
        <AccommodationSummaryCard data={snapshot?.accommodation?.data} />
        <FamilyMembersCard familyMembers={snapshot?.familyMembers} />
        <DocumentsSummaryCard documents={documents} isLoading={isDocumentsLoading} />
        <ActivityTimelineCard activity={activity} isLoading={isActivityLoading} />
        <NotificationsCard notifications={notifications} isLoading={isNotificationsLoading} />
        <QuickActionsCard />
      </div>
    </div>
  );
};

export default DashboardPage;
