import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardStepShell } from '../components/WizardStepShell';
import { WizardField } from '../components/WizardField';
import { useSaveWizardStep } from '../hooks/useSaveWizardStep';
import { saveMedicalInformation } from '@/api/registration.api';
import {
  medicalInformationSchema,
  medicalInformationDefaults,
  BLOOD_GROUPS,
} from '@/validators/medicalInformation.schema';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[1]; // Emergency Contact
const NEXT_STEP = WIZARD_STEP_META[3]; // Travel Information

export const MedicalInformationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveMedicalInformation);

  const form = useForm({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: { ...medicalInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

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
      <WizardField label="Blood Group" error={form.formState.errors.bloodGroup?.message}>
        <Select
          value={form.watch('bloodGroup')}
          onValueChange={(value) =>
            form.setValue('bloodGroup', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="w-full">
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

      <WizardField label="Doctor Name" error={form.formState.errors.doctorName?.message}>
        <Input {...form.register('doctorName')} placeholder="Optional" />
      </WizardField>

      <WizardField
        label="Medical Conditions"
        className="sm:col-span-2"
        error={form.formState.errors.medicalConditions?.message}
      >
        <Textarea {...form.register('medicalConditions')} placeholder="Optional" rows={2} />
      </WizardField>

      <WizardField
        label="Current Medicines"
        className="sm:col-span-2"
        error={form.formState.errors.currentMedicines?.message}
      >
        <Textarea {...form.register('currentMedicines')} placeholder="Optional" rows={2} />
      </WizardField>

      <WizardField
        label="Allergies"
        className="sm:col-span-2"
        error={form.formState.errors.allergies?.message}
      >
        <Textarea {...form.register('allergies')} placeholder="Optional" rows={2} />
      </WizardField>

      <WizardField
        label="Emergency Notes"
        className="sm:col-span-2"
        error={form.formState.errors.emergencyNotes?.message}
      >
        <Textarea {...form.register('emergencyNotes')} placeholder="Optional" rows={2} />
      </WizardField>
    </WizardStepShell>
  );
};

export default MedicalInformationStep;
