import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, Share2, ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { DigitalPassCard } from '@/features/dashboard/components/DigitalPassCard';
import { generatePassPdf } from '@/utils/generatePassPdf';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

export const DigitalPassPage = () => {
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: documents } = useDocuments();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const digitalPass = snapshot?.digitalPass;
  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  const handleShare = async () => {
    const shareData = {
      title: 'My Digital Pass',
      text: 'Kumbh Registration — Digital Pass',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownload = async () => {
    if (!digitalPass) return;
    setIsGeneratingPdf(true);
    try {
      const isRevoked = digitalPass.status === 'revoked';
      const isVerified = Boolean(digitalPass.passActivated) && !isRevoked;
      const verificationLabel = isRevoked ? 'Revoked' : isVerified ? 'Verified' : 'Pending On-Site Verification';

      await generatePassPdf(
        {
          pilgrimName: snapshot?.personalInformation?.data?.fullName,
          hideRegistrationNumber: true,
          eventName: snapshot?.event?.name,
          statusLabel: getRegistrationStatusMeta(snapshot?.registrationStatus).label,
          verificationLabel,
          accommodation: snapshot?.accommodation?.data?.address || snapshot?.accommodation?.data?.type,
          qrImage: digitalPass.qrImage,
        },
        `${snapshot?.registrationNumber || 'digital-pass'}.pdf`
      );
    } catch {
      toast.error('Could not generate PDF. Try Print instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <div className={`flex flex-1 flex-col gap-4 px-4 pt-4 ${digitalPass ? 'pb-24' : 'pb-4'}`}>
        <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5 print:hidden">
          <Link to="/dashboard">
            <ArrowLeft className="size-4" /> Back to Dashboard
          </Link>
        </Button>

        {!digitalPass ? (
          <div className="glass-card flex flex-col items-center gap-3 rounded-3xl px-8 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Your digital pass will be generated once your registration is submitted.
            </p>
          </div>
        ) : (
          // Centered, fixed-width pass — buttons live in the sticky bar
          // below instead of the flow, so there's no overlap or clipping
          // regardless of how tall the card gets.
          <div className="mx-auto w-full">
            <DigitalPassCard
              digitalPass={digitalPass}
              personal={snapshot?.personalInformation?.data}
              accommodation={snapshot?.accommodation?.data}
              registrationStatus={snapshot?.registrationStatus}
              registrationNumber={snapshot?.registrationNumber}
              hideRegistrationNumber
              eventName={snapshot?.event?.name}
              profilePhotoUrl={profilePhoto?.url}
            />
          </div>
        )}
      </div>

      {digitalPass && (
        <div className="sticky bottom-0 z-10 flex items-center gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur print:hidden">
          <Button variant="outline" className="h-11 flex-1 gap-1.5" onClick={() => window.print()}>
            <Printer className="size-4" /> Print
          </Button>
          <Button
            variant="outline"
            className="h-11 flex-1 gap-1.5"
            onClick={handleDownload}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download
          </Button>
          <Button variant="outline" size="icon" className="h-11 w-11 shrink-0" onClick={handleShare} aria-label="Share">
            <Share2 className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DigitalPassPage;
