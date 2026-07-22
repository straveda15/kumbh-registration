import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Drop-in replacement for <Input type="password" /> — same element, same
// classes/props at every call site, just with a Show/Hide toggle. Kept as
// its own small component (rather than inlining the toggle at each of the
// app's password fields) so every password input in the app stays visually
// and behaviorally identical.
export const PasswordInput = ({ className, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
};

export default PasswordInput;
