import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { ScanLine, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SCANNER_ELEMENT_ID = 'shared-qr-scanner';

// Role-agnostic camera + manual-entry QR scanner — used by the Operator's
// pass-verification page and the Public scan-to-register page. Camera scan
// and manual entry both feed the same `onDetected(code)`; the caller
// decides what a detected code means (verify a pass vs. start a
// registration). Text is prop-driven so neither caller needs role-specific
// wording hardcoded into a shared component.
export const QrScanner = ({
  onDetected,
  disabled,
  scanTitle = 'Scan QR Code',
  scanHint = 'Point the camera at the QR code.',
  manualLabel = 'Manual Code Entry',
  manualPlaceholder = 'Enter code',
  submitLabel = 'Submit',
}) => {
  const scannerRef = useRef(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setCameraError(null);
    setIsCameraActive(false);

    // Html5Qrcode's constructor throws synchronously (a plain string, not
    // an Error) if its target element isn't in the DOM yet — guard it so a
    // timing hiccup shows the manual-entry fallback instead of crashing.
    let scanner;
    try {
      scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    } catch {
      setCameraError('Camera unavailable — use manual code entry below.');
      return undefined;
    }
    scannerRef.current = scanner;

    // Tracks whether this effect instance has been cleaned up. Needed
    // because React StrictMode (and fast back/forward navigation) can
    // unmount before the async start() below resolves; without this flag
    // the success/error callbacks would run against a scanner that's
    // already gone.
    let cancelled = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (!cancelled) onDetected(decodedText);
        },
        () => {
          // Per-frame "no QR found" callback — expected on almost every
          // frame, not a real error.
        }
      )
      .then(() => {
        if (cancelled) {
          // Cleanup already ran while the camera was still starting up —
          // release it now instead of leaving it running unattended.
          scanner.stop().catch(() => {});
          return;
        }
        setIsCameraActive(true);
      })
      .catch((error) => {
        if (cancelled) return;
        // The rejection here is whatever getUserMedia() rejected with — a
        // real DOMException with a `.name`, so branch on it for messaging
        // that matches what the user actually needs to do next.
        const name = error?.name;
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setCameraError('Camera permission denied. Please allow camera access and try again.');
        } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
          setCameraError('No camera available on this device. Use manual code entry below.');
        } else if (name === 'NotReadableError' || name === 'TrackStartError') {
          setCameraError('Camera is already in use by another app. Use manual code entry below.');
        } else {
          setCameraError('Camera unavailable. Use manual code entry below.');
        }
      });

    return () => {
      cancelled = true;
      // Html5Qrcode.stop() throws synchronously (not a rejected promise)
      // when the camera never reached the SCANNING state — e.g. cleanup
      // running before start() resolves. Checking getState() first (and
      // still guarding with try/catch against the inherent race between
      // the check and the call) keeps that throw from ever escaping this
      // cleanup and reaching the error boundary.
      try {
        if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
          scanner.stop().catch(() => {});
        }
      } catch {
        // Already stopped or never started — nothing to clean up.
      }
    };
    // `onDetected` intentionally excluded — it's often a fresh inline
    // function each render from the caller, and re-running this effect on
    // every render would restart the camera constantly. `retryKey` is the
    // only intended re-run trigger, for the manual Retry button below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const handleManualSubmit = (event) => {
    event.preventDefault();
    if (!manualCode.trim()) return;
    onDetected(manualCode.trim());
    setManualCode('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card overflow-hidden rounded-2xl border-none p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <ScanLine className="size-4 text-primary" /> {scanTitle}
        </div>
        <div
          id={SCANNER_ELEMENT_ID}
          className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl bg-black/40"
        />
        {cameraError && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{cameraError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRetryKey((key) => key + 1)}
            >
              Retry
            </Button>
          </div>
        )}
        {isCameraActive && <p className="mt-2 text-xs text-muted-foreground">{scanHint}</p>}
      </div>

      <div className="glass-card rounded-2xl border-none p-4">
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
          <Label htmlFor="manual-code" className="flex items-center gap-2 text-sm font-medium text-foreground">
            <KeyRound className="size-4 text-primary" /> {manualLabel}
          </Label>
          <div className="flex gap-2">
            <Input
              id="manual-code"
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder={manualPlaceholder}
              disabled={disabled}
            />
            <Button type="submit" disabled={disabled || !manualCode.trim()}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QrScanner;
