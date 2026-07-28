import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, Share2, RotateCcw, Loader2 } from 'lucide-react';
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
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 items-center justify-center px-4 py-6">
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const digitalPass = snapshot?.digitalPass;
  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');
  const rejectionReason = snapshot?.rejectionReason || snapshot?.statusNote;

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
      await generatePassPdf(
        {
          pilgrimName: snapshot?.personalInformation?.data?.fullName,
          registrationNumber: snapshot?.registrationNumber,
          hideRegistrationNumber: true,
          eventName: snapshot?.event?.name,
          statusLabel: getRegistrationStatusMeta(snapshot?.registrationStatus).label,
          verificationLabel: digitalPass.verificationStatus || 'PENDING',
          accommodation: snapshot?.accommodation?.data?.address || snapshot?.accommodation?.data?.type,
          qrImage: digitalPass.qrImage,
          profilePhotoUrl: profilePhoto?.url,
          rejectionReason,
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
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-4 px-4 py-6">
      {/* ── Pass card ── */}
      {!digitalPass ? (
        <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-8 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Your digital pass will be generated once your registration is submitted.
          </p>
        </div>
      ) : (
        <>
          {/* On-screen Entry Pass (100% UNCHANGED) */}
          <DigitalPassCard
            digitalPass={digitalPass}
            personal={snapshot?.personalInformation?.data}
            accommodation={snapshot?.accommodation?.data}
            registrationStatus={snapshot?.registrationStatus}
            registrationNumber={snapshot?.registrationNumber}
            hideRegistrationNumber
            eventName={snapshot?.event?.name}
            profilePhotoUrl={profilePhoto?.url}
            rejectionReason={rejectionReason}
          />

          {/* ── Action buttons directly below card in normal flow ── */}
          <div className="flex items-center gap-2 print:hidden">
            <Button
              variant="outline"
              className="h-10 flex-1 gap-1.5 text-[13px] font-medium"
              onClick={() => window.print()}
            >
              <Printer className="size-4 shrink-0" />
              Print
            </Button>

            <Button
              variant="outline"
              className="h-10 flex-1 gap-1.5 text-[13px] font-medium"
              onClick={handleDownload}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <Download className="size-4 shrink-0" />
              )}
              Download
            </Button>

            <Button
              variant="outline"
              className="h-10 flex-1 gap-1.5 text-[13px] font-medium"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="size-4 shrink-0" />
              Share
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DigitalPassPage;
