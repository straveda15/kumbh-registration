import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generic collapsible card — same header/chevron idiom as
// MobileRegistrationSummary, reused here for "My Registration" /
// "Edit Registration"'s per-step sections instead of a bespoke pattern.
export const CollapsibleSection = ({ title, icon: Icon, defaultOpen = false, badge, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card rounded-2xl border-none">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-foreground">
          {Icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="size-4" />
            </span>
          )}
          <span className="truncate">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {badge}
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t border-border px-4 py-4 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
