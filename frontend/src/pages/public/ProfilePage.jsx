import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RotateCcw, UserRound, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { CompactRow } from '@/components/shared/CompactRow';
import { RegistrationNumberCard } from '@/features/dashboard/components/RegistrationNumberCard';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useSaveAccountCredentials } from '@/features/registration-wizard/hooks/useSaveAccountCredentials';
import { useChangeAccountPassword } from '@/features/registration-wizard/hooks/useChangeAccountPassword';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';

// Deliberately separate from personalInformation.schema.js — that schema
// backs the full wizard step (address, Aadhaar, language, ...), most of
// which no longer shows on this simplified Profile page at all. This is
// just the 3 fields Edit Profile actually lets a pilgrim change.
const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  mobile: z.string().trim().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const PASSWORD_DEFAULTS = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const ProfilePage = () => {
  const code = useDraftSessionStore((state) => state.code);
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: documents } = useDocuments();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const updateProfileMutation = useSaveAccountCredentials(code);
  const changePasswordMutation = useChangeAccountPassword();

  const personal = snapshot?.personalInformation?.data;

  const profileForm = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { fullName: '', email: '', mobile: '' },
  });

  // Snapshot loads async — seed the edit form once real data arrives.
  useEffect(() => {
    if (personal) {
      profileForm.reset({
        fullName: personal.fullName || '',
        email: personal.email || '',
        mobile: personal.mobile || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personal?.fullName, personal?.email, personal?.mobile]);

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: PASSWORD_DEFAULTS,
  });

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  const onSubmitProfile = profileForm.handleSubmit(async (values) => {
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (err) {
      const field = err.errors?.[0]?.field;
      if (field === 'email' || field === 'mobile') {
        profileForm.setError(field, { message: err.message });
      }
      toast.error(err.message || 'Could not update profile');
    }
  });

  const onSubmitPassword = passwordForm.handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync(values);
      toast.success('Password changed successfully');
      passwordForm.reset(PASSWORD_DEFAULTS);
    } catch (err) {
      const field = err.errors?.[0]?.field;
      if (field === 'currentPassword') {
        passwordForm.setError('currentPassword', { message: err.message });
      }
      toast.error(err.message || 'Could not change password');
    }
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
      <div className="glass-card flex flex-col items-center gap-3 rounded-2xl border-none p-5 text-center">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 ring-2 ring-border">
          {profilePhoto ? (
            <img src={profilePhoto.url} alt="Profile" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8 text-primary" />
          )}
        </div>
        <p className="text-lg font-semibold text-foreground">{personal?.fullName || 'Your Profile'}</p>
        <div className="w-full">
          <DocumentUploadCard type="profilePhoto" variant="compact" />
        </div>
      </div>

      <RegistrationNumberCard registrationNumber={snapshot?.registrationNumber} />

      {!isEditingProfile ? (
        <div className="glass-card rounded-2xl border-none p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Account Details</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-primary"
              onClick={() => setIsEditingProfile(true)}
            >
              <Pencil className="size-3.5" /> Edit
            </Button>
          </div>
          <CompactRow label="Mobile Number" value={personal?.mobile} />
          <CompactRow label="Email" value={personal?.email} />
        </div>
      ) : (
        <form onSubmit={onSubmitProfile} className="glass-card flex flex-col gap-3 rounded-2xl border-none p-4">
          <p className="text-sm font-semibold text-foreground">Edit Profile</p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" className="h-12" {...profileForm.register('fullName')} />
            {profileForm.formState.errors.fullName && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" className="h-12" {...profileForm.register('email')} />
            {profileForm.formState.errors.email && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-mobile">Mobile Number</Label>
            <Input
              id="profile-mobile"
              inputMode="numeric"
              className="h-12"
              {...profileForm.register('mobile')}
            />
            {profileForm.formState.errors.mobile && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.mobile.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={() => {
                setIsEditingProfile(false);
                profileForm.reset({
                  fullName: personal?.fullName || '',
                  email: personal?.email || '',
                  mobile: personal?.mobile || '',
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 flex-1" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      )}

      <div className="glass-card rounded-2xl border-none p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Change Password</p>
        <form onSubmit={onSubmitPassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              className="h-12"
              autoComplete="current-password"
              {...passwordForm.register('currentPassword')}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              id="new-password"
              className="h-12"
              autoComplete="new-password"
              {...passwordForm.register('newPassword')}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <PasswordInput
              id="confirm-new-password"
              className="h-12"
              autoComplete="new-password"
              {...passwordForm.register('confirmPassword')}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="h-11" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
