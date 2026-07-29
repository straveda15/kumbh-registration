import { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const WebcamCaptureDialog = ({ open, onOpenChange, onCaptured }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const startCamera = async () => {
    setError(null);
    setLoading(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err.message || 'Could not access camera. Please ensure permissions are granted.');
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Draw flipped for natural user-facing mirror perspective
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          stopCamera();
          onOpenChange(false);
          onCaptured(blob);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) stopCamera();
        onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Camera className="size-5 text-primary" /> Take Photo with Camera
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-black/90 border border-border">
          {error ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-destructive gap-2">
              <AlertCircle className="size-8" />
              <p className="text-sm font-medium">{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={startCamera} className="mt-2 gap-1.5 rounded-xl">
                <RefreshCw className="size-3.5" /> Try Again
              </Button>
            </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xs z-10">
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">Starting camera...</p>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="size-full object-cover -scale-x-100"
              />
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          {!error && (
            <Button
              type="button"
              onClick={handleCapture}
              disabled={loading}
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-[var(--w-accent-hover)] font-semibold shadow-md"
            >
              <Camera className="size-4" /> Capture Photo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebcamCaptureDialog;
