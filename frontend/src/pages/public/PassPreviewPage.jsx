import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { PassPreviewCard } from '@/features/dashboard/components/PassPreviewCard';

// Public-safe counterpart to /pass (DigitalPassPage, which shows the real
// entry QR/pilgrim ID) — this is what the dashboard links to. See
// PassPreviewCard for exactly what's deliberately left out and why.
export const PassPreviewPage = () => {
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
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </Button>

      {!snapshot?.digitalPass ? (
        <div className="glass-card flex flex-col items-center gap-3 rounded-3xl px-8 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your entry pass preview will appear here once your registration is submitted.
          </p>
        </div>
      ) : (
        <PassPreviewCard
          digitalPass={snapshot?.digitalPass}
          personal={snapshot?.personalInformation?.data}
          accommodation={snapshot?.accommodation?.data}
          registrationStatus={snapshot?.registrationStatus}
          registrationNumber={snapshot?.registrationNumber}
          eventName={snapshot?.event?.name}
          profilePhotoUrl={profilePhoto?.url}
        />
      )}
    </div>
  );
};

export default PassPreviewPage;
