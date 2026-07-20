import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, Share2, ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { DigitalPassCard } from '@/features/dashboard/components/DigitalPassCard';
import { generatePassPdf } from '@/utils/generatePassPdf';

export const DigitalPassPage = () => {
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: documents } = useDocuments();
  const passRef = useRef(null);
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
      text: `Registration Number: ${snapshot?.registrationNumber}`,
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
    if (!passRef.current) return;
    setIsGeneratingPdf(true);
    try {
      await generatePassPdf(passRef.current, `${snapshot?.registrationNumber || 'digital-pass'}.pdf`);
    } catch {
      toast.error('Could not generate PDF. Try Print instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-5 px-4 py-10">
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
        <>
          <DigitalPassCard
            ref={passRef}
            digitalPass={digitalPass}
            personal={snapshot?.personalInformation?.data}
            accommodation={snapshot?.accommodation?.data}
            registrationStatus={snapshot?.registrationStatus}
            registrationNumber={snapshot?.registrationNumber}
            profilePhotoUrl={profilePhoto?.url}
          />

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button variant="outline" className="flex-1 gap-1.5" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleDownload}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download
            </Button>
            <Button variant="outline" className="flex-1 gap-1.5" onClick={handleShare}>
              <Share2 className="size-4" /> Share
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DigitalPassPage;
