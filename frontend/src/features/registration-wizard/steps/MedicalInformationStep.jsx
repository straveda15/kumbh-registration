import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { WizardStepShell } from '../components/WizardStepShell';
import { WizardField } from '../components/WizardField';
import { useSaveWizardStep } from '../hooks/useSaveWizardStep';
import { saveMedicalInformation } from '@/api/registration.api';
import {
  medicalInformationSchema,
  medicalInformationDefaults,
  BLOOD_GROUPS,
  MEDICAL_CONDITIONS_OPTIONS,
  MEDICAL_ALLERGIES_OPTIONS,
} from '@/validators/medicalInformation.schema';
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[1]; // Emergency Contact
const NEXT_STEP = WIZARD_STEP_META[3]; // Travel Information

export const MedicalInformationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveMedicalInformation);
  const setLiveSection = useWizardLiveDraftStore((state) => state.setLiveSection);

  // Normalize initial values if stored as legacy strings
  const parsedConditions = Array.isArray(initialData?.medicalConditions)
    ? initialData.medicalConditions
    : initialData?.medicalConditions
    ? [initialData.medicalConditions]
    : [];

  const parsedAllergies = Array.isArray(initialData?.allergies)
    ? initialData.allergies
    : initialData?.allergies
    ? [initialData.allergies]
    : [];

  const form = useForm({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: {
      ...medicalInformationDefaults,
      ...initialData,
      medicalConditions: parsedConditions,
      allergies: parsedAllergies,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = form.watch((values) => setLiveSection('medicalProfile', values));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedConditions = form.watch('medicalConditions') || [];
  const selectedAllergies = form.watch('allergies') || [];

  const persist = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    try {
      await saveMutation.mutateAsync(form.getValues());
      toast.success('Medical information saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save medical information');
      return false;
    }
  };

  return (
    <WizardStepShell
      title="Medical Information"
      description="Step 3 of 7 — Help us keep you safe during the event"
      icon={HeartPulse}
      form={form}
      onPersist={persist}
      previousStep={PREVIOUS_STEP}
      nextStep={NEXT_STEP}
      saveStatus={saveMutation.status}
      isSaving={saveMutation.isPending}
    >
      <WizardField label="Blood Group *" error={form.formState.errors.bloodGroup?.message}>
        <Select
          value={form.watch('bloodGroup')}
          onValueChange={(value) =>
            form.setValue('bloodGroup', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="h-14 w-full px-4">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </WizardField>

      <WizardField label="Family Doctor Name" error={form.formState.errors.doctorName?.message}>
        <Input className="h-14 px-4" {...form.register('doctorName')} placeholder="Optional" />
      </WizardField>

      {/* ── Medical Conditions ── */}
      <WizardField
        label="Medical Conditions"
        className="col-span-full"
        error={form.formState.errors.medicalConditions?.message}
      >
        <MultiSelectDropdown
          options={MEDICAL_CONDITIONS_OPTIONS}
          value={selectedConditions}
          onChange={(newVal) =>
            form.setValue('medicalConditions', newVal, { shouldValidate: true, shouldDirty: true })
          }
          placeholder="Select medical conditions (or None)..."
        />
      </WizardField>

      {selectedConditions.includes('Other') && (
        <WizardField
          label="Please specify"
          className="col-span-full"
          error={form.formState.errors.medicalConditionsOther?.message}
        >
          <Input
            className="h-14 px-4"
            {...form.register('medicalConditionsOther')}
            placeholder="Specify medical conditions"
          />
        </WizardField>
      )}

      {/* ── Current Medicines ── */}
      <WizardField
        label="Current Medicines"
        className="col-span-full"
        error={form.formState.errors.currentMedicines?.message}
      >
        <Textarea className="px-4 py-3" {...form.register('currentMedicines')} placeholder="Optional" rows={2} />
      </WizardField>

      {/* ── Medical Allergies ── */}
      <WizardField
        label="Medical Allergies"
        className="col-span-full"
        error={form.formState.errors.allergies?.message}
      >
        <MultiSelectDropdown
          options={MEDICAL_ALLERGIES_OPTIONS}
          value={selectedAllergies}
          onChange={(newVal) =>
            form.setValue('allergies', newVal, { shouldValidate: true, shouldDirty: true })
          }
          placeholder="Select allergies (or None)..."
        />
      </WizardField>

      {selectedAllergies.includes('Other') && (
        <WizardField
          label="Please specify"
          className="col-span-full"
          error={form.formState.errors.allergiesOther?.message}
        >
          <Input
            className="h-14 px-4"
            {...form.register('allergiesOther')}
            placeholder="Specify medical allergies"
          />
        </WizardField>
      )}

      {/* ── Emergency Notes ── */}
      <WizardField
        label="Emergency Notes"
        className="col-span-full"
        error={form.formState.errors.emergencyNotes?.message}
      >
        <Textarea className="px-4 py-3" {...form.register('emergencyNotes')} placeholder="Optional" rows={2} />
      </WizardField>
    </WizardStepShell>
  );
};

export default MedicalInformationStep;
