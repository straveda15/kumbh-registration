import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardStepShell } from '../components/WizardStepShell';
import { WizardField } from '../components/WizardField';
import { useSaveWizardStep } from '../hooks/useSaveWizardStep';
import { saveEmergencyContact } from '@/api/registration.api';
import {
  emergencyContactSchema,
  emergencyContactDefaults,
} from '@/validators/emergencyContact.schema';
import { RELATIONSHIP_OPTIONS } from '@/utils/relationshipOptions';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[0]; // Personal Information
const NEXT_STEP = WIZARD_STEP_META[2]; // Medical Information

export const EmergencyContactStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveEmergencyContact);

  const form = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { ...emergencyContactDefaults, ...initialData },
    mode: 'onBlur',
  });

  const persist = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    try {
      await saveMutation.mutateAsync(form.getValues());
      toast.success('Emergency contact saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save emergency contact');
      return false;
    }
  };

  return (
    <WizardStepShell
      title="Emergency Contact"
      description="Step 2 of 7 — Who should we contact in an emergency?"
      icon={PhoneCall}
      form={form}
      onPersist={persist}
      previousStep={PREVIOUS_STEP}
      nextStep={NEXT_STEP}
      saveStatus={saveMutation.status}
      isSaving={saveMutation.isPending}
    >
      <WizardField label="Contact Name" error={form.formState.errors.contactName?.message}>
        <Input className="h-14 px-4" {...form.register('contactName')} placeholder="Full name" />
      </WizardField>

      <WizardField label="Relationship" error={form.formState.errors.relationship?.message}>
        <Select
          value={form.watch('relationship')}
          onValueChange={(value) =>
            form.setValue('relationship', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="h-14 w-full px-4">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {RELATIONSHIP_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </WizardField>

      <WizardField label="Phone" error={form.formState.errors.phone?.message}>
        <Input
          className="h-14 px-4"
          {...form.register('phone')}
          inputMode="numeric"
          placeholder="10-digit phone number"
        />
      </WizardField>

      <WizardField
        label="Alternative Phone"
        error={form.formState.errors.alternativePhone?.message}
      >
        <Input
          className="h-14 px-4"
          {...form.register('alternativePhone')}
          inputMode="numeric"
          placeholder="Optional"
        />
      </WizardField>
    </WizardStepShell>
  );
};

export default EmergencyContactStep;
