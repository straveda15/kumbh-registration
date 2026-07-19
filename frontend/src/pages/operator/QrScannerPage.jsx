import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { QrScanner } from '@/components/shared/QrScanner';
import { CitizenVerificationCard } from '@/features/operator/components/CitizenVerificationCard';
import { useVerifyPass } from '@/features/operator/hooks/useVerifyPass';
import { useLogScan } from '@/features/operator/hooks/useLogScan';

export const QrScannerPage = () => {
  const verifyMutation = useVerifyPass();
  const logScanMutation = useLogScan();
  const [verification, setVerification] = useState(null);

  const handleDetected = (code) => {
    if (verifyMutation.isPending) return;
    verifyMutation.mutate(code, {
      onSuccess: (result) => setVerification(result),
      onError: (err) => toast.error(err.message || 'Pass not found'),
    });
  };

  const handleDecision = (result) => {
    logScanMutation.mutate(
      { digitalPassId: verification.digitalPass._id, result },
      {
        onSuccess: () => {
          toast.success(result === 'approved' ? 'Entry approved' : 'Entry rejected');
          setVerification(null);
        },
        onError: (err) => toast.error(err.message || 'Could not log this scan'),
      }
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">QR Scanner</h1>
          <p className="text-sm text-muted-foreground">Scan a pass or enter a code to verify a pilgrim at the gate.</p>
        </div>
        {verification && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setVerification(null)}>
            <RotateCcw className="size-3.5" /> Scan Another
          </Button>
        )}
      </div>

      <div className="mx-auto w-full max-w-lg">
        {verifyMutation.isPending ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : verification ? (
          <CitizenVerificationCard
            verification={verification}
            isSubmitting={logScanMutation.isPending}
            onApprove={() => handleDecision('approved')}
            onReject={() => handleDecision('rejected')}
          />
        ) : (
          <QrScanner
            onDetected={handleDetected}
            disabled={verifyMutation.isPending}
            scanTitle="Scan Digital Pass QR"
            scanHint="Point the camera at the pilgrim's pass QR code."
            manualLabel="Manual Code Entry"
            manualPlaceholder="Registration number or Pilgrim ID"
            submitLabel="Verify"
          />
        )}
      </div>
    </div>
  );
};

export default QrScannerPage;
