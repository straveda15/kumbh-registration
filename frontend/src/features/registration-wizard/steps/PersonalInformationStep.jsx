import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowRight, UserRound, Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';
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
import { fetchDemoAadhaar } from '@/api/registration.api';
import {
  personalInformationSchema,
  personalInformationDefaults,
  LANGUAGE_OPTIONS,
} from '@/validators/personalInformation.schema';
import { INDIAN_STATES_AND_UTS } from '@/utils/indianStates';
import { getVillagesForTaluka } from '@/utils/indianCitiesByState';
import { DISTRICTS_BY_STATE } from '@/utils/indianDistrictsByState';
import {
  getAvailableDistricts,
  getAvailableTalukas,
  getAvailableCities,
} from '@/utils/indianLocationLookup';
import { computeAge } from '@/utils/computeAge';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';
import { useDocuments } from '@/features/documents/hooks/useDocuments';

const NEXT_STEP = WIZARD_STEP_META[1]; // Emergency Contact

const STATE_OPTIONS = INDIAN_STATES_AND_UTS.map((state) => ({ value: state, label: state }));
const EMPTY_OPTIONS = [];

const renderLabel = (label) => {
  if (typeof label !== 'string') return label;
  if (label.endsWith('*')) {
    const mainText = label.slice(0, -1).trimEnd();
    return (
      <>
        {mainText} <span className="text-destructive font-medium ml-0.5">*</span>
      </>
    );
  }
  return label;
};

const Field = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <Label className="text-base font-semibold text-foreground">{renderLabel(label)}</Label>
    {children}
    {error && <p className="text-xs text-[#FF7262] animate-in fade-in duration-200">{error}</p>}
  </div>
);

export const PersonalInformationStep = ({ code, initialData }) => {
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const setLiveSection = useWizardLiveDraftStore((state) => state.setLiveSection);
  const saveMutation = useSavePersonalInformation(code);
  const saveAccountMutation = useSaveAccountCredentials(code);

  const [aadhaarStatus, setAadhaarStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'new' | 'error'
  const [demoPhotoUrl, setDemoPhotoUrl] = useState(initialData?.photoUrl || null);
  const lastFetchedAadhaarRef = useRef(null);

  // Used to check if a profile photo has been uploaded (mandatory).
  const { data: allDocuments } = useDocuments();

  const form = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: { ...personalInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  // Auto-fetch Aadhaar demo details when 12 digits are reached
  const watchAadhaar = form.watch('aadhaarNumber');

  useEffect(() => {
    const cleanAadhaar = (watchAadhaar || '').replace(/\D/g, '');
    if (cleanAadhaar.length === 12 && lastFetchedAadhaarRef.current !== cleanAadhaar) {
      lastFetchedAadhaarRef.current = cleanAadhaar;
      setAadhaarStatus('loading');

      fetchDemoAadhaar(cleanAadhaar)
        .then((data) => {
          if (!data) {
            if (aadhaarStatus === 'success') {
              form.setValue('fullName', '', { shouldDirty: true });
              form.setValue('gender', '', { shouldDirty: true });
              form.setValue('dob', '', { shouldDirty: true });
              form.setValue('mobile', '', { shouldDirty: true });
              form.setValue('alternateMobile', '', { shouldDirty: true });
              form.setValue('email', '', { shouldDirty: true });
              form.setValue('state', '', { shouldDirty: true });
              form.setValue('district', '', { shouldDirty: true });
              form.setValue('taluka', '', { shouldDirty: true });
              form.setValue('village', '', { shouldDirty: true });
              form.setValue('address', '', { shouldDirty: true });
              form.setValue('pinCode', '', { shouldDirty: true });
              form.setValue('photoUrl', '', { shouldDirty: true });
              setDemoPhotoUrl(null);
            }
            setAadhaarStatus('new');
            toast.success('New Aadhaar detected.');
            return;
          }

          setAadhaarStatus('success');
          toast.success('Existing record found. Details have been auto-filled.');

          if (data.fullName) form.setValue('fullName', data.fullName, { shouldValidate: true, shouldDirty: true });
          if (data.gender) form.setValue('gender', data.gender, { shouldValidate: true, shouldDirty: true });
          if (data.dob) form.setValue('dob', data.dob, { shouldValidate: true, shouldDirty: true });
          if (data.mobile) form.setValue('mobile', data.mobile, { shouldValidate: true, shouldDirty: true });
          if (data.alternateMobile) form.setValue('alternateMobile', data.alternateMobile, { shouldValidate: true, shouldDirty: true });
          if (data.email) form.setValue('email', data.email, { shouldValidate: true, shouldDirty: true });
          if (data.nationality) form.setValue('nationality', data.nationality, { shouldValidate: true, shouldDirty: true });
          if (data.state) form.setValue('state', data.state, { shouldValidate: true, shouldDirty: true });
          if (data.district) form.setValue('district', data.district, { shouldValidate: true, shouldDirty: true });
          if (data.taluka) form.setValue('taluka', data.taluka, { shouldValidate: true, shouldDirty: true });
          if (data.village) form.setValue('village', data.village, { shouldValidate: true, shouldDirty: true });
          if (data.address) form.setValue('address', data.address, { shouldValidate: true, shouldDirty: true });
          if (data.pinCode) form.setValue('pinCode', data.pinCode, { shouldValidate: true, shouldDirty: true });

          if (data.photo) {
            form.setValue('photoUrl', data.photo, { shouldValidate: true, shouldDirty: true });
            setDemoPhotoUrl(data.photo);
          }
        })
        .catch(() => {
          if (aadhaarStatus === 'success') {
            form.setValue('fullName', '', { shouldDirty: true });
            form.setValue('gender', '', { shouldDirty: true });
            form.setValue('dob', '', { shouldDirty: true });
            form.setValue('mobile', '', { shouldDirty: true });
            form.setValue('alternateMobile', '', { shouldDirty: true });
            form.setValue('email', '', { shouldDirty: true });
            form.setValue('state', '', { shouldDirty: true });
            form.setValue('district', '', { shouldDirty: true });
            form.setValue('taluka', '', { shouldDirty: true });
            form.setValue('village', '', { shouldDirty: true });
            form.setValue('address', '', { shouldDirty: true });
            form.setValue('pinCode', '', { shouldDirty: true });
            form.setValue('photoUrl', '', { shouldDirty: true });
            setDemoPhotoUrl(null);
          }
          setAadhaarStatus('new');
          toast.success('New Aadhaar detected.');
        });
    } else if (cleanAadhaar.length < 12) {
      lastFetchedAadhaarRef.current = null;
      if (aadhaarStatus !== 'idle') {
        setAadhaarStatus('idle');
      }
    }
  }, [watchAadhaar, form, aadhaarStatus]);

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
  const selectedTaluka = form.watch('taluka');
  const selectedCity = form.watch('village');

  // Dynamic location options
  const districtList = getAvailableDistricts(selectedState, selectedCity);
  const districtOptions = districtList.map((d) => ({ value: d, label: d }));

  const talukaList = getAvailableTalukas(selectedState, selectedDistrict, selectedCity);
  const talukaOptions = talukaList.map((t) => ({ value: t, label: t }));

  const cityList = getAvailableCities(selectedState, selectedDistrict, selectedTaluka);
  const villageOptions = cityList.map((c) => ({ value: c, label: c }));

  // Check whether a profile photo has been uploaded or auto-filled.
  const profilePhotoDoc = (allDocuments || []).find((doc) => doc.type === 'profilePhoto');
  const hasPhoto = Boolean(profilePhotoDoc || demoPhotoUrl);

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

  const [photoTouched, setPhotoTouched] = useState(false);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const handleNext = async () => {
    // Photo is mandatory — block navigation if not uploaded.
    if (!hasPhoto) {
      setPhotoTouched(true);
      toast.error('Please upload or capture a profile photo before continuing.');
      return;
    }

    const saved = await persist();
    if (saved) setActiveStep(NEXT_STEP.key);
  };

  const isLoadingDetails = aadhaarStatus === 'loading';
  const isAutofilled = aadhaarStatus === 'success';

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
          <form
            onBlur={persist}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {/* Aadhaar Card Number — Full width at the top */}
            <Field label="Aadhaar Card Number *" error={form.formState.errors.aadhaarNumber?.message} className="col-span-full">
              <div className="relative flex items-center">
                <Input
                  className="h-14 px-4 pr-11"
                  {...form.register('aadhaarNumber')}
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="12-digit Aadhaar number"
                />
                <div className="absolute right-3.5 flex items-center pointer-events-none">
                  {aadhaarStatus === 'loading' && <Loader2 className="size-5 animate-spin text-primary" />}
                  {(aadhaarStatus === 'success' || aadhaarStatus === 'new') && <CheckCircle2 className="size-5 text-emerald-500" />}
                  {aadhaarStatus === 'error' && <XCircle className="size-5 text-destructive" />}
                </div>
              </div>
            </Field>

            {/* Profile Photo upload section — directly below Aadhaar */}
            <div className="col-span-full">
              <DocumentUploadCard type="profilePhoto" variant="compact" demoPhotoUrl={demoPhotoUrl} />
              {!hasPhoto && photoTouched && (
                <p className="mt-1.5 text-xs text-[#FF7262] animate-in fade-in duration-200">
                  Profile photo is required. Please upload or capture a photo.
                </p>
              )}
            </div>

            <Field label="Full Name (as per ID) *" className="lg:col-span-2" error={form.formState.errors.fullName?.message}>
              <Input className="h-14 px-4" {...form.register('fullName')} disabled={isLoadingDetails || isAutofilled} placeholder="As per government ID" />
            </Field>

            <Field label="Gender *" error={form.formState.errors.gender?.message}>
              <Select
                disabled={isLoadingDetails || isAutofilled}
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

            <Field label="Date of Birth *" error={form.formState.errors.dob?.message}>
              <Input className="h-14 px-4" type="date" max={yesterdayStr} {...form.register('dob')} disabled={isLoadingDetails || isAutofilled} />
            </Field>

            <Field label="Age">
              <Input className="h-14 px-4" value={age} disabled placeholder="Auto-calculated" />
            </Field>

            <Field label="Nationality *" error={form.formState.errors.nationality?.message}>
              <Input className="h-14 px-4" {...form.register('nationality')} disabled={isLoadingDetails || isAutofilled} />
            </Field>

            <Field label="Mobile Number *" error={form.formState.errors.mobile?.message}>
              <Input
                className="h-14 px-4"
                {...form.register('mobile')}
                inputMode="numeric"
                maxLength={10}
                disabled={isLoadingDetails || isAutofilled}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
                placeholder="10-digit mobile number"
              />
            </Field>

            <Field label="Alternate Mobile Number" error={form.formState.errors.alternateMobile?.message}>
              <Input
                className="h-14 px-4"
                {...form.register('alternateMobile')}
                inputMode="numeric"
                maxLength={10}
                disabled={isLoadingDetails || isAutofilled}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
                placeholder="Optional"
              />
            </Field>

            <Field label="Email *" error={form.formState.errors.email?.message}>
              <Input className="h-14 px-4" type="email" {...form.register('email')} disabled={isLoadingDetails || isAutofilled} placeholder="you@example.com" />
            </Field>

            <Field label="Password *" error={form.formState.errors.password?.message}>
              <PasswordInput
                className="h-14 px-4"
                {...form.register('password')}
                placeholder="Create Password"
                autoComplete="new-password"
              />
            </Field>

            <Field label="Confirm Password *" error={form.formState.errors.confirmPassword?.message}>
              <PasswordInput
                className="h-14 px-4"
                {...form.register('confirmPassword')}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </Field>

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

            {/* ── State → District → Taluka → Village cascading dropdowns ── */}
            <Field label="State *" error={form.formState.errors.state?.message}>
              <Combobox
                className="h-14 px-4"
                options={STATE_OPTIONS}
                value={selectedState}
                onValueChange={(value) => {
                  form.setValue('state', value, { shouldValidate: true, shouldDirty: true });
                  // Reset dependent fields whenever state changes.
                  form.setValue('district', '', { shouldValidate: false, shouldDirty: true });
                  form.setValue('taluka', '', { shouldValidate: false, shouldDirty: true });
                  form.setValue('village', '', { shouldValidate: false, shouldDirty: true });
                }}
                placeholder="Select State"
                searchPlaceholder="Search states…"
                emptyText="No matching state or UT."
                disabled={isLoadingDetails || isAutofilled}
              />
            </Field>

            <Field label="District" error={form.formState.errors.district?.message}>
              <Combobox
                className="h-14 px-4"
                options={districtOptions}
                value={selectedDistrict}
                onValueChange={(value) => {
                  form.setValue('district', value, { shouldValidate: false, shouldDirty: true });
                }}
                placeholder={selectedState ? 'Select District (Optional)' : 'Select State first'}
                searchPlaceholder="Search districts…"
                emptyText="No matching district."
                allowCustomValue
                disabled={!selectedState || isLoadingDetails || isAutofilled}
              />
            </Field>

            <Field label="Taluka" error={form.formState.errors.taluka?.message}>
              <Combobox
                className="h-14 px-4"
                options={talukaOptions}
                value={selectedTaluka}
                onValueChange={(value) => {
                  form.setValue('taluka', value, { shouldValidate: false, shouldDirty: true });
                }}
                placeholder={selectedState ? 'Select Taluka (Optional)' : 'Select State first'}
                searchPlaceholder="Search talukas…"
                emptyText="No matching taluka."
                allowCustomValue
                disabled={!selectedState || isLoadingDetails || isAutofilled}
              />
            </Field>

            <Field label="Village / Town *" error={form.formState.errors.village?.message}>
              <Combobox
                className="h-14 px-4"
                options={villageOptions}
                value={form.watch('village')}
                onValueChange={(value) =>
                  form.setValue('village', value, { shouldValidate: true, shouldDirty: true })
                }
                placeholder={selectedState ? 'Select Village / Town / City' : 'Select State first'}
                searchPlaceholder="Search village or town…"
                emptyText="No matching village — pick 'Use' below to enter as typed."
                allowCustomValue
                disabled={!selectedState || isLoadingDetails || isAutofilled}
              />
            </Field>

            {/* Address — optional */}
            <Field
              label="Address"
              className="lg:col-span-2"
              error={form.formState.errors.address?.message}
            >
              <Input className="h-14 px-4" {...form.register('address')} disabled={isLoadingDetails || isAutofilled} placeholder="House / street (optional)" />
            </Field>

            <Field label="PIN Code *" error={form.formState.errors.pinCode?.message}>
              <Input className="h-14 px-4" {...form.register('pinCode')} disabled={isLoadingDetails || isAutofilled} inputMode="numeric" placeholder="6-digit PIN" />
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
