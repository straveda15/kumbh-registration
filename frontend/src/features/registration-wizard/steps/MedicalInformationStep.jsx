import { useEffect } from 'react';
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
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[1]; // Emergency Contact
const NEXT_STEP = WIZARD_STEP_META[3]; // Travel Information

export const MedicalInformationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveMedicalInformation);
  const setLiveSection = useWizardLiveDraftStore((state) => state.setLiveSection);

  const form = useForm({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: { ...medicalInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = form.watch((values) => setLiveSection('medicalProfile', values));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <WizardField label="Doctor Name" error={form.formState.errors.doctorName?.message}>
        <Input className="h-14 px-4" {...form.register('doctorName')} placeholder="Optional" />
      </WizardField>

      <WizardField
        label="Medical Conditions"
        className="col-span-full"
        error={form.formState.errors.medicalConditions?.message}
      >
        <Textarea className="px-4 py-3" {...form.register('medicalConditions')} placeholder="Optional" rows={2} />
      </WizardField>

      <WizardField
        label="Current Medicines"
        className="col-span-full"
        error={form.formState.errors.currentMedicines?.message}
      >
        <Textarea className="px-4 py-3" {...form.register('currentMedicines')} placeholder="Optional" rows={2} />
      </WizardField>

      <WizardField
        label="Medical Allergies"
        className="col-span-full"
        error={form.formState.errors.allergies?.message}
      >
        <Textarea className="px-4 py-3" {...form.register('allergies')} placeholder="Optional" rows={2} />
      </WizardField>

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
