import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AutosaveIndicator } from '../components/AutosaveIndicator';
import { useSavePersonalInformation } from '../hooks/useSavePersonalInformation';
import { useSaveAccountCredentials } from '../hooks/useSaveAccountCredentials';
import {
  personalInformationSchema,
  personalInformationDefaults,
} from '@/validators/personalInformation.schema';
import { computeAge } from '@/utils/computeAge';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const NEXT_STEP = WIZARD_STEP_META[1]; // Emergency Contact

const Field = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export const PersonalInformationStep = ({ code, initialData }) => {
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const saveMutation = useSavePersonalInformation(code);
  const saveAccountMutation = useSaveAccountCredentials(code);

  const form = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: { ...personalInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  const age = computeAge(form.watch('dob'));

  // Autosave: React's onBlur bubbles from any descendant field, so a single
  // handler on the form covers every input. Only persists once the whole
  // step passes validation — the backend's PUT accepts any payload shape,
  // so "is this step done" is a frontend concern, not something the API
  // enforces.
  //
  // password/confirmPassword are split out and sent to the dedicated
  // account-credentials endpoint instead of the generic personal-info
  // save (see registration.api.js) — a plaintext password must never ride
  // along in the same payload as address/dob/etc. Left blank on repeat
  // saves (editing this step after the account already exists), so the
  // pilgrim isn't forced to re-enter their password on every autosave.
  const persist = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;

    const { password, confirmPassword, ...personalFields } = form.getValues();
    await saveMutation.mutateAsync(personalFields);

    if (password) {
      try {
        await saveAccountMutation.mutateAsync({
          fullName: personalFields.fullName,
          email: personalFields.email,
          mobile: personalFields.mobile,
          password,
          confirmPassword,
        });
      } catch (error) {
        const field = error.errors?.[0]?.field;
        if (field === 'email' || field === 'mobile') {
          form.setError(field, { message: error.message });
        }
        toast.error(error.message || 'Could not save account credentials');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    const saved = await persist();
    if (saved) setActiveStep(NEXT_STEP.key);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <UserRound className="size-4.5" />
            </span>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Step 1 of 7 — Tell us who you are</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onBlur={persist}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <Field label="Full Name" error={form.formState.errors.fullName?.message}>
              <Input {...form.register('fullName')} placeholder="As per government ID" />
            </Field>

            <Field label="Gender" error={form.formState.errors.gender?.message}>
              <Select
                value={form.watch('gender')}
                onValueChange={(value) =>
                  form.setValue('gender', value, { shouldValidate: true, shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Date of Birth" error={form.formState.errors.dob?.message}>
              <Input type="date" {...form.register('dob')} />
            </Field>

            <Field label="Age">
              <Input value={age} disabled placeholder="Auto-calculated" />
            </Field>

            <Field label="Mobile Number" error={form.formState.errors.mobile?.message}>
              <Input {...form.register('mobile')} inputMode="numeric" placeholder="10-digit mobile number" />
            </Field>

            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register('email')} placeholder="you@example.com" />
            </Field>

            <Field
              label="Password"
              error={form.formState.errors.password?.message}
            >
              <Input
                type="password"
                {...form.register('password')}
                placeholder="Set a password to create your account"
                autoComplete="new-password"
              />
            </Field>

            <Field
              label="Confirm Password"
              error={form.formState.errors.confirmPassword?.message}
            >
              <Input
                type="password"
                {...form.register('confirmPassword')}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Nationality" error={form.formState.errors.nationality?.message}>
              <Input {...form.register('nationality')} />
            </Field>

            <Field label="Preferred Language" error={form.formState.errors.language?.message}>
              <Input {...form.register('language')} placeholder="e.g. Hindi, Marathi, English" />
            </Field>

            <Field
              label="Address"
              className="sm:col-span-2"
              error={form.formState.errors.address?.message}
            >
              <Input {...form.register('address')} placeholder="House / street" />
            </Field>

            <Field label="State" error={form.formState.errors.state?.message}>
              <Input {...form.register('state')} />
            </Field>

            <Field label="District" error={form.formState.errors.district?.message}>
              <Input {...form.register('district')} />
            </Field>

            <Field label="Taluka" error={form.formState.errors.taluka?.message}>
              <Input {...form.register('taluka')} />
            </Field>

            <Field label="Village / Town" error={form.formState.errors.village?.message}>
              <Input {...form.register('village')} />
            </Field>

            <Field label="PIN Code" error={form.formState.errors.pinCode?.message}>
              <Input {...form.register('pinCode')} inputMode="numeric" placeholder="6-digit PIN" />
            </Field>
          </form>
        </CardContent>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <AutosaveIndicator
          status={saveAccountMutation.isPending ? 'pending' : saveMutation.status}
        />
        <Button
          onClick={handleNext}
          disabled={saveMutation.isPending || saveAccountMutation.isPending}
          className="gap-1.5"
        >
          Next: {NEXT_STEP.label} <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalInformationStep;
