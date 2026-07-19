import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, LayoutDashboard, LogIn, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const CopyableField = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
    <div className="text-left">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-medium text-foreground">{value}</p>
    </div>
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        toast.success(`${label} copied`);
      }}
    >
      <Copy className="size-3.5" />
    </Button>
  </div>
);

export const SubmitSuccessPage = () => {
  const location = useLocation();
  const { registrationNumber, pilgrimId } = location.state ?? {};

  if (!registrationNumber || !pilgrimId) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-5 px-4 text-center">
        <PartyPopper className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold text-foreground">Confirmation not found here</h1>
        <p className="text-sm text-muted-foreground">
          This confirmation isn't in this browser's history (maybe this page was reloaded or
          bookmarked). Your registration details are still available on your dashboard.
        </p>
        <Button asChild className="gap-1.5">
          <Link to="/dashboard">
            <LayoutDashboard className="size-4" /> Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-card flex flex-col items-center gap-5 rounded-3xl px-8 py-12"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <PartyPopper className="size-8" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Registration Successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your registration has been submitted successfully.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <CopyableField label="Registration Number" value={registrationNumber} />
          <CopyableField label="Pilgrim ID" value={pilgrimId} />
        </div>

        <p className="text-sm text-muted-foreground">
          You can now log in using your registered Email Address and Password.
        </p>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1 gap-2">
            <Link to="/dashboard">
              <LayoutDashboard className="size-4" /> Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 gap-2">
            <Link to="/login">
              <LogIn className="size-4" /> Go to Login
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmitSuccessPage;
