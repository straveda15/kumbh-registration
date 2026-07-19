import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// "Back to Home" — exists ONLY on the three login pages (Admin/Operator/
// Pilgrim, see AuthLayout), never on an authenticated page. Always
// navigates to a fixed route via React Router (default "/"), not browser
// history-back, so behavior is predictable regardless of how the user
// arrived at the login page.
export const BackButton = ({ to = '/', label = 'Back to Home', className }) => (
  <Button asChild variant="ghost" size="sm" className={cn('gap-1.5', className)}>
    <Link to={to}>
      <ArrowLeft className="size-4" /> {label}
    </Link>
  </Button>
);

export default BackButton;
