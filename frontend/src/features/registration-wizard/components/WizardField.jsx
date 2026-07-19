import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Shared label+control+error wrapper for steps 2-5 (Step 1 has its own
// local copy predating this — see WizardStepShell.jsx notes).
export const WizardField = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default WizardField;
