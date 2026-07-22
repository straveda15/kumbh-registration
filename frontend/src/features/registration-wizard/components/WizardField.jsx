import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Shared label+control+error wrapper for steps 2-5 (Step 1 has its own
// local copy predating this — see WizardStepShell.jsx notes).
export const WizardField = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label className="text-base font-semibold text-foreground">{label}</Label>
    {children}
    {error && <p className="text-xs text-[#FF7262] animate-in fade-in duration-200">{error}</p>}
  </div>
);

export default WizardField;
