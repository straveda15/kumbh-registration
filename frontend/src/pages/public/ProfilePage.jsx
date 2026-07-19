import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, UserRound, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WizardProgressBar } from '@/features/registration-wizard/components/WizardProgressBar';
import { FamilyMemberTable } from '@/features/registration-wizard/components/FamilyMemberTable';
import { FamilyMemberCard } from '@/features/registration-wizard/components/FamilyMemberCard';
import { ProfileSummaryCard } from '@/features/dashboard/components/ProfileSummaryCard';
import { EmergencyContactSummaryCard } from '@/features/dashboard/components/EmergencyContactSummaryCard';
import { MedicalSummaryCard } from '@/features/dashboard/components/MedicalSummaryCard';
import { TravelSummaryCard } from '@/features/dashboard/components/TravelSummaryCard';
import { AccommodationSummaryCard } from '@/features/dashboard/components/AccommodationSummaryCard';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';

const EditLink = ({ code, step }) => (
  <Button asChild variant="ghost" size="sm" className="gap-1.5 text-primary">
    <Link to={`/register/${code}`} state={{ step }}>
      <Pencil className="size-3.5" /> Edit
    </Link>
  </Button>
);

export const ProfilePage = () => {
  const code = useDraftSessionStore((state) => state.code);
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: documents } = useDocuments();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 px-4 py-10 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const isDraft = snapshot?.registrationStatus === 'draft';
  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </Button>

      <div className="glass-card flex flex-col items-center gap-4 rounded-2xl border-none px-6 py-8 text-center sm:flex-row sm:text-left">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
          {profilePhoto ? (
            <img src={profilePhoto.url} alt="Profile" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {snapshot?.personalInformation?.data?.fullName || 'Your Profile'}
          </h1>
          <div className="mt-2 max-w-sm">
            <WizardProgressBar percentage={snapshot?.completionPercentage ?? 0} />
          </div>
          {!isDraft && (
            <p className="mt-2 text-xs text-muted-foreground">
              Your registration has been submitted and can no longer be edited.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ProfileSummaryCard
          data={snapshot?.personalInformation?.data}
          detailed
          action={isDraft ? <EditLink code={code} step="personalInformation" /> : null}
        />
        <EmergencyContactSummaryCard data={snapshot?.emergencyContact?.data} />
        <MedicalSummaryCard data={snapshot?.medicalProfile?.data} detailed />
        <TravelSummaryCard data={snapshot?.travelInformation?.data} detailed />
        <AccommodationSummaryCard data={snapshot?.accommodation?.data} />

        <SummaryCard title="Family Members" icon={UserRound} className="sm:col-span-2">
          {(snapshot?.familyMembers || []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No family members were added.</p>
          ) : (
            <>
              <FamilyMemberTable members={snapshot.familyMembers} />
              <FamilyMemberCard members={snapshot.familyMembers} />
            </>
          )}
        </SummaryCard>
      </div>

      {isDraft && (
        <Button asChild className="w-fit gap-1.5">
          <Link to={`/register/${code}`}>
            <Pencil className="size-4" /> Continue Editing in Wizard
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ProfilePage;
