import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/AuthLayout';
import { usePilgrimLogin } from '@/features/pilgrimAuth/hooks/usePilgrimAuth';

// A pilgrim account (email+password, set during registration's Personal
// Information step) is completely independent from Admin/Operator — its
// own backend route (/api/v1/pilgrim/login), own JWT secret, own Zustand
// store (usePilgrimAuthStore). See draftAuth.middleware.js for how this
// token and the anonymous wizard draft token both resolve to the same
// registration-access shape without either knowing about the other.
//
// Login itself is keyed on Registration Number, not the account email —
// the backend resolves it to the owning User via Registration.userId (see
// pilgrimAuth.service.js). That number only exists once a registration is
// actually submitted, so this page can't be used to resume an in-progress
// draft; the wizard's own draft-token session handles that separately.
export const PilgrimLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = usePilgrimLogin();
  // Prefilled when arriving with a Registration Number already in route
  // state (e.g. copied from the Account Information page on another
  // device) so the pilgrim doesn't have to retype it.
  const [registrationNumber, setRegistrationNumber] = useState(
    location.state?.registrationNumber || ''
  );
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginMutation.mutateAsync({ registrationNumber, password });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid registration number or password');
    }
  };

  return (
    <AuthLayout icon={UserRound} title="Pilgrim Login" subtitle="Sign in to your account" showBack={false}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            type="text"
            value={registrationNumber}
            onChange={(event) => setRegistrationNumber(event.target.value)}
            placeholder="KP2027MH000123"
            required
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" size="lg" className="mt-2 gap-1.5" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Login
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/scan" className="font-medium text-primary hover:underline">
          Register Now
        </Link>
      </p>
    </AuthLayout>
  );
};

export default PilgrimLoginPage;
