import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QrScanner } from '@/components/shared/QrScanner';

// A printed event QR encodes the full "/register/:code" URL (see
// backend/src/services/qr.service.js) so a phone's native camera app can
// open it directly — this page's own scanner reads that same value, so it
// must pull the code back out of the URL rather than nesting the whole
// string under another "/register/" segment.
const isMalformedCode = (candidate) => !candidate || /[\s/:]/.test(candidate);

const extractRegistrationCode = (scannedValue) => {
  const value = scannedValue.trim();

  try {
    // Scanned a full URL (localhost during dev, or the real production
    // domain) — pull the code from the segment right after "register" in
    // its pathname, rather than assuming the last segment is it (a URL
    // truncated to just ".../register/" has no code, and blindly taking
    // the last segment would misread "register" itself as the code).
    const segments = new URL(value).pathname.split('/').filter(Boolean);
    const registerIndex = segments.lastIndexOf('register');
    const candidate = registerIndex === -1 ? undefined : segments[registerIndex + 1];
    return isMalformedCode(candidate) ? '' : candidate;
  } catch {
    // Not an absolute URL — the scanned value is already the bare code,
    // as long as it doesn't itself look malformed.
    return isMalformedCode(value) ? '' : value;
  }
};

export const ScanPage = () => {
  const navigate = useNavigate();

  const handleDetected = (rawValue) => {
    const code = extractRegistrationCode(rawValue);
    if (!code) {
      toast.error('That QR code isn\'t recognized. Try again or enter the code manually.');
      return;
    }
    navigate(`/register/${code}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-5 px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Scan Event QR Code</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Point your camera at the QR code at the event entrance to start your registration.
        </p>
      </div>

      <QrScanner
        onDetected={handleDetected}
        scanTitle="Scan Event QR Code"
        scanHint="Point the camera at the event QR code."
        manualLabel="Enter Code Manually"
        manualPlaceholder="Event QR code"
        submitLabel="Continue"
      />
    </div>
  );
};

export default ScanPage;
