import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserRound, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { useAdminProfile, useUpdateAdminProfile, useChangeAdminPassword } from '@/features/admin/hooks/useAdminAuth';
import {
  adminUpdateProfileSchema,
  adminUpdateProfileDefaults,
  adminChangePasswordSchema,
  adminChangePasswordDefaults,
} from '@/validators/adminProfile.schema';

export const AdminProfilePage = () => {
  const { data: profile, isPending } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangeAdminPassword();

  const profileForm = useForm({
    resolver: zodResolver(adminUpdateProfileSchema),
    defaultValues: adminUpdateProfileDefaults,
  });

  // Profile loads async — seed the form once it arrives rather than on
  // first render, when it's still undefined.
  useEffect(() => {
    if (profile) {
      profileForm.reset({ name: profile.name, email: profile.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const passwordForm = useForm({
    resolver: zodResolver(adminChangePasswordSchema),
    defaultValues: adminChangePasswordDefaults,
  });

  const onSubmitProfile = profileForm.handleSubmit(async (values) => {
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success('Profile updated successfully');
    } catch (error) {
      const field = error.errors?.[0]?.field;
      if (field === 'email') {
        profileForm.setError('email', { message: error.message });
      }
      toast.error(error.message || 'Could not update profile');
    }
  });

  const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      toast.success('Password changed successfully');
      passwordForm.reset(adminChangePasswordDefaults);
    } catch (error) {
      const field = error.errors?.[0]?.field;
      if (field === 'currentPassword') {
        passwordForm.setError('currentPassword', { message: error.message });
      }
      toast.error(error.message || 'Could not change password');
    }
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your admin account details.</p>
      </div>

      <SummaryCard title="Account Details" icon={UserRound}>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-3/5" />
          </div>
        ) : (
          <form onSubmit={onSubmitProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-name">Name</Label>
                <Input id="admin-name" {...profileForm.register('name')} />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" {...profileForm.register('email')} />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-fit" disabled={updateProfileMutation.isPending}>
              Save Changes
            </Button>
          </form>
        )}
      </SummaryCard>

      <SummaryCard title="Change Password" icon={KeyRound}>
        <form onSubmit={onSubmitPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              {...passwordForm.register('currentPassword')}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-fit" disabled={changePasswordMutation.isPending}>
            Update Password
          </Button>
        </form>
      </SummaryCard>
    </div>
  );
};

export default AdminProfilePage;
