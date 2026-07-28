import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { AutosaveIndicator } from '../components/AutosaveIndicator';
import { useSavePersonalInformation } from '../hooks/useSavePersonalInformation';
import { useSaveAccountCredentials } from '../hooks/useSaveAccountCredentials';
import {
  personalInformationSchema,
  personalInformationDefaults,
  LANGUAGE_OPTIONS,
} from '@/validators/personalInformation.schema';
import { INDIAN_STATES_AND_UTS } from '@/utils/indianStates';
import { CITIES_BY_STATE } from '@/utils/indianCitiesByState';
import { DISTRICTS_BY_STATE } from '@/utils/indianDistrictsByState';
import { TALUKAS_BY_DISTRICT } from '@/utils/indianTalukasByDistrict';
import { computeAge } from '@/utils/computeAge';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';
import { useDocuments } from '@/features/documents/hooks/useDocuments';

const NEXT_STEP = WIZARD_STEP_META[1]; // Emergency Contact

const STATE_OPTIONS = INDIAN_STATES_AND_UTS.map((state) => ({ value: state, label: state }));
const EMPTY_OPTIONS = [];

// Built once at module load — stable references so re-renders caused by
// live-preview mirroring (form.watch effect) don't rebuild on every keystroke.
const CITY_OPTIONS_BY_STATE = Object.fromEntries(
  Object.entries(CITIES_BY_STATE).map(([state, cities]) => [
    state,
    cities.map((city) => ({ value: city, label: city })),
  ])
);

const DISTRICT_OPTIONS_BY_STATE = Object.fromEntries(
  Object.entries(DISTRICTS_BY_STATE).map(([state, districts]) => [
    state,
    districts.map((d) => ({ value: d, label: d })),
  ])
);

const TALUKA_OPTIONS_BY_DISTRICT = Object.fromEntries(
  Object.entries(TALUKAS_BY_DISTRICT).map(([district, talukas]) => [
    district,
    talukas.map((t) => ({ value: t, label: t })),
  ])
);

const Field = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label className="text-base font-semibold text-foreground">{label}</Label>
    {children}
    {error && <p className="text-xs text-[#FF7262] animate-in fade-in duration-200">{error}</p>}
  </div>
);

export const PersonalInformationStep = ({ code, initialData }) => {
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const setLiveSection = useWizardLiveDraftStore((state) => state.setLiveSection);
  const saveMutation = useSavePersonalInformation(code);
  const saveAccountMutation = useSaveAccountCredentials(code);

  // Used to check if a profile photo has been uploaded (mandatory).
  const { data: allDocuments } = useDocuments();

  const form = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: { ...personalInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  // Mirrors every keystroke into the live-draft store so LivePreviewPanel
  // can reflect it immediately, instead of only after a field blurs and
  // the step autosaves.
  useEffect(() => {
    const subscription = form.watch((values) => setLiveSection('personalInformation', values));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const age = computeAge(form.watch('dob'));
  const selectedState = form.watch('state');
  const selectedDistrict = form.watch('district');

  // Cascading options — each tier reads from its stable pre-built map.
  const cityOptions = selectedState
    ? CITY_OPTIONS_BY_STATE[selectedState] || EMPTY_OPTIONS
    : EMPTY_OPTIONS;

  const districtOptions = selectedState
    ? DISTRICT_OPTIONS_BY_STATE[selectedState] || EMPTY_OPTIONS
    : EMPTY_OPTIONS;

  const talukaOptions = selectedDistrict
    ? TALUKA_OPTIONS_BY_DISTRICT[selectedDistrict] || EMPTY_OPTIONS
    : EMPTY_OPTIONS;

  // Check whether a profile photo has been uploaded.
  const profilePhotoDoc = (allDocuments || []).find((doc) => doc.type === 'profilePhoto');
  const hasPhoto = Boolean(profilePhotoDoc);

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
    // Photo is mandatory — block navigation if not uploaded.
    if (!hasPhoto) {
      toast.error('Please upload or capture a profile photo before continuing.');
      return;
    }

    const saved = await persist();
    if (saved) setActiveStep(NEXT_STEP.key);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card rounded-2xl border-none [--card-spacing:--spacing(4)] sm:rounded-[24px] sm:[--card-spacing:--spacing(6)] lg:[--card-spacing:--spacing(10)]">
        <CardHeader className="gap-2 sm:gap-3">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Step</p>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-11">
              <UserRound className="size-5" />
            </span>
            <div>
              <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Personal Information</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Provide your identity, address and language preference.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Profile Photo — mandatory. Show error hint when missing. */}
          <div className="mb-3 sm:mb-4">
            <DocumentUploadCard type="profilePhoto" variant="compact" />
            {!hasPhoto && (
              <p className="mt-1.5 text-xs text-[#FF7262] animate-in fade-in duration-200">
                Profile photo is required. Please upload or capture a photo.
              </p>
            )}
          </div>

          <form
            onBlur={persist}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            <Field label="Full Name (as per ID)" className="lg:col-span-2" error={form.formState.errors.fullName?.message}>
              <Input className="h-14 px-4" {...form.register('fullName')} placeholder="As per government ID" />
            </Field>

            <Field label="Gender" error={form.formState.errors.gender?.message}>
              <Select
                value={form.watch('gender')}
                onValueChange={(value) =>
                  form.setValue('gender', value, { shouldValidate: true, shouldDirty: true })
                }
              >
                <SelectTrigger className="h-14 w-full px-4">
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
              <Input className="h-14 px-4" type="date" {...form.register('dob')} />
            </Field>

            <Field label="Age">
              <Input className="h-14 px-4" value={age} disabled placeholder="Auto-calculated" />
            </Field>

            <Field label="Nationality" error={form.formState.errors.nationality?.message}>
              <Input className="h-14 px-4" {...form.register('nationality')} />
            </Field>

            <Field label="Aadhaar Card Number *" error={form.formState.errors.aadhaarNumber?.message}>
              <Input
                className="h-14 px-4"
                {...form.register('aadhaarNumber')}
                inputMode="numeric"
                maxLength={12}
                placeholder="12-digit Aadhaar number"
              />
            </Field>

            <Field label="Mobile Number" error={form.formState.errors.mobile?.message}>
              <Input
                className="h-14 px-4"
                {...form.register('mobile')}
                inputMode="numeric"
                placeholder="10-digit mobile number"
              />
            </Field>

            <Field label="Alternate Mobile Number" error={form.formState.errors.alternateMobile?.message}>
              <Input
                className="h-14 px-4"
                {...form.register('alternateMobile')}
                inputMode="numeric"
                placeholder="Optional"
              />
            </Field>

            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input className="h-14 px-4" type="email" {...form.register('email')} placeholder="you@example.com" />
            </Field>

            {/* Preferred Language — optional, expanded to 14 languages */}
            <Field label="Preferred Language" error={form.formState.errors.language?.message}>
              <Select
                value={form.watch('language')}
                onValueChange={(value) =>
                  form.setValue('language', value, { shouldValidate: true, shouldDirty: true })
                }
              >
                <SelectTrigger className="h-14 w-full px-4">
                  <SelectValue placeholder="Select Preferred Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Password" error={form.formState.errors.password?.message}>
              <PasswordInput
                className="h-14 px-4"
                {...form.register('password')}
                placeholder="Create Password"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm Password" error={form.formState.errors.confirmPassword?.message}>
              <PasswordInput
                className="h-14 px-4"
                {...form.register('confirmPassword')}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </Field>

            {/* ── State → District → Taluka cascading dropdowns ── */}
            <Field label="State" error={form.formState.errors.state?.message}>
              <Combobox
                className="h-14 px-4"
                options={STATE_OPTIONS}
                value={selectedState}
                onValueChange={(value) => {
                  form.setValue('state', value, { shouldValidate: true, shouldDirty: true });
                  // Reset dependent fields whenever state changes.
                  form.setValue('district', '', { shouldValidate: false, shouldDirty: true });
                  form.setValue('taluka', '', { shouldValidate: false, shouldDirty: true });
                  form.setValue('village', '', { shouldValidate: true, shouldDirty: true });
                }}
                placeholder="Select State"
                searchPlaceholder="Search states…"
                emptyText="No matching state or UT."
              />
            </Field>

            {/* District — optional, disabled until a state is selected */}
            <Field label="District" error={form.formState.errors.district?.message}>
              <Combobox
                className="h-14 px-4"
                options={districtOptions}
                value={selectedDistrict}
                onValueChange={(value) => {
                  form.setValue('district', value, { shouldValidate: true, shouldDirty: true });
                  // Reset taluka whenever district changes.
                  form.setValue('taluka', '', { shouldValidate: false, shouldDirty: true });
                }}
                placeholder={selectedState ? 'Select District' : 'Select State first'}
                searchPlaceholder="Search districts…"
                emptyText="No matching district."
                disabled={!selectedState}
              />
            </Field>

            {/* Taluka — optional, disabled until a district is selected */}
            <Field label="Taluka" error={form.formState.errors.taluka?.message}>
              <Combobox
                className="h-14 px-4"
                options={talukaOptions}
                value={form.watch('taluka')}
                onValueChange={(value) =>
                  form.setValue('taluka', value, { shouldValidate: true, shouldDirty: true })
                }
                placeholder={selectedDistrict ? 'Select Taluka' : 'Select District first'}
                searchPlaceholder="Search talukas…"
                emptyText="No matching taluka — pick 'Use' below to enter as typed."
                allowCustomValue
                disabled={!selectedDistrict}
              />
            </Field>

            <Field label="Village / Town" error={form.formState.errors.village?.message}>
              <Combobox
                className="h-14 px-4"
                options={cityOptions}
                value={form.watch('village')}
                onValueChange={(value) =>
                  form.setValue('village', value, { shouldValidate: true, shouldDirty: true })
                }
                placeholder={selectedState ? 'Select City / Town' : 'Select State First'}
                searchPlaceholder="Search city or town…"
                emptyText="No matching city — pick 'Use' below to enter it as typed."
                allowCustomValue
                disabled={!selectedState}
              />
            </Field>

            {/* Address — optional */}
            <Field
              label="Address"
              className="lg:col-span-2"
              error={form.formState.errors.address?.message}
            >
              <Input className="h-14 px-4" {...form.register('address')} placeholder="House / street (optional)" />
            </Field>

            <Field label="PIN Code" error={form.formState.errors.pinCode?.message}>
              <Input className="h-14 px-4" {...form.register('pinCode')} inputMode="numeric" placeholder="6-digit PIN" />
            </Field>
          </form>
        </CardContent>
      </Card>

      <div className="mt-3 text-center sm:hidden">
        <AutosaveIndicator status={saveAccountMutation.isPending ? 'pending' : saveMutation.status} />
      </div>

      {/* Sticky action bar — Continue is always one thumb-reach away
          without hunting for it at the bottom of a long form. */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:justify-between sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="hidden sm:block">
          <AutosaveIndicator status={saveAccountMutation.isPending ? 'pending' : saveMutation.status} />
        </div>
        <Button
          onClick={handleNext}
          disabled={saveMutation.isPending || saveAccountMutation.isPending}
          className="h-12 w-full gap-1.5 rounded-2xl px-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--w-accent-hover)] sm:h-[52px] sm:w-auto"
        >
          Save &amp; Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalInformationStep;
