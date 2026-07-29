import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const renderLabel = (label) => {
  if (typeof label !== 'string') return label;
  if (label.endsWith('*')) {
    const mainText = label.slice(0, -1).trimEnd();
    return (
      <>
        {mainText} <span className="text-destructive font-medium ml-0.5">*</span>
      </>
    );
  }
  return label;
};

// Shared label+control+error wrapper for steps 2-5
export const WizardField = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label className="text-base font-semibold text-foreground">{renderLabel(label)}</Label>
    {children}
    {error && <p className="text-xs text-[#FF7262] animate-in fade-in duration-200">{error}</p>}
  </div>
);

export default WizardField;
