import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BedDouble } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardStepShell } from '../components/WizardStepShell';
import { WizardField } from '../components/WizardField';
import { useSaveWizardStep } from '../hooks/useSaveWizardStep';
import { saveAccommodation } from '@/api/registration.api';
import {
  accommodationSchema,
  accommodationDefaults,
  ACCOMMODATION_TYPES,
} from '@/validators/accommodation.schema';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[3]; // Travel Information
const NEXT_STEP = WIZARD_STEP_META[5]; // Family Members

export const AccommodationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveAccommodation);

  const form = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: { ...accommodationDefaults, ...initialData },
    mode: 'onBlur',
  });

  const persist = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    try {
      await saveMutation.mutateAsync(form.getValues());
      toast.success('Accommodation details saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save accommodation details');
      return false;
    }
  };

  return (
    <WizardStepShell
      title="Accommodation"
      description="Step 5 of 7 — Where will you be staying?"
      icon={BedDouble}
      form={form}
      onPersist={persist}
      previousStep={PREVIOUS_STEP}
      nextStep={NEXT_STEP}
      saveStatus={saveMutation.status}
      isSaving={saveMutation.isPending}
    >
      <WizardField label="Accommodation Type" error={form.formState.errors.type?.message}>
        <Select
          value={form.watch('type')}
          onValueChange={(value) =>
            form.setValue('type', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select accommodation type" />
          </SelectTrigger>
          <SelectContent>
            {ACCOMMODATION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </WizardField>

      <WizardField label="Accommodation Address" error={form.formState.errors.address?.message}>
        <Input {...form.register('address')} placeholder="Where you'll be staying" />
      </WizardField>
    </WizardStepShell>
  );
};

export default AccommodationStep;
