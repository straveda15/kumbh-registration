import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/AuthLayout';
import { usePilgrimLogin } from '@/features/pilgrimAuth/hooks/usePilgrimAuth';

// A pilgrim account (email+password, set during registration's Personal
// Information step) is completely independent from Admin/Operator — its
// own backend route (/api/v1/pilgrim/login), own JWT secret, own Zustand
// store (usePilgrimAuthStore). See draftAuth.middleware.js for how this
// token and the anonymous wizard draft token both resolve to the same
// registration-access shape without either knowing about the other.
export const PilgrimLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = usePilgrimLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout icon={UserRound} title="Pilgrim Login" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
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
