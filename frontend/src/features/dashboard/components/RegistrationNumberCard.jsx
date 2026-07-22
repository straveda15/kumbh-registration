import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// The one identifier a pilgrim actually needs to see and copy — it's their
// login username. Shown compactly on both Dashboard and Profile (same
// component, not duplicated markup).
export const RegistrationNumberCard = ({ registrationNumber, className }) => {
  if (!registrationNumber) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(registrationNumber);
    toast.success('Registration Number copied');
  };

  return (
    <div
      className={cn(
        'glass-card flex items-center justify-between gap-3 rounded-2xl border-none px-4 py-3',
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">Registration Number</p>
        <p className="truncate font-mono text-base font-bold text-foreground">{registrationNumber}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={handleCopy}
        aria-label="Copy registration number"
      >
        <Copy className="size-4" />
      </Button>
    </div>
  );
};

export default RegistrationNumberCard;
