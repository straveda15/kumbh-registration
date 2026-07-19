import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useAdminLogin } from '@/features/admin/hooks/useAdminAuth';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useAdminLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout icon={ShieldCheck} title="Admin Portal" subtitle="Sign in to manage registrations">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
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
        <Button type="submit" className="mt-2 gap-1.5" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLoginPage;
