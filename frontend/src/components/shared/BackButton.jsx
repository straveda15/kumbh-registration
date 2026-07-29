import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// "Back to Home" — exists ONLY on the two login pages (Admin/Pilgrim, see
// AuthLayout), never on an authenticated page. Always
// navigates to a fixed route via React Router (default "/"), not browser
// history-back, so behavior is predictable regardless of how the user
// arrived at the login page.
export const BackButton = ({ to = '/', label = 'Back to Home', className }) => (
  <Button
    asChild
    variant="outline"
    size="sm"
    className={cn(
      'gap-2 rounded-xl border-border/80 bg-background/80 px-4 text-xs font-semibold text-foreground shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0',
      className
    )}
  >
    <Link to={to}>
      <ArrowLeft className="size-3.5 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  </Button>
);

export default BackButton;
