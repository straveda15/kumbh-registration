import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Route } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardStepShell } from '../components/WizardStepShell';
import { WizardField } from '../components/WizardField';
import { useSaveWizardStep } from '../hooks/useSaveWizardStep';
import { saveTravelInformation } from '@/api/registration.api';
import {
  travelInformationSchema,
  travelInformationDefaults,
  TRAVEL_MODES,
} from '@/validators/travelInformation.schema';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[2]; // Medical Information
const NEXT_STEP = WIZARD_STEP_META[4]; // Accommodation

export const TravelInformationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveTravelInformation);

  const form = useForm({
    resolver: zodResolver(travelInformationSchema),
    defaultValues: { ...travelInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  const persist = async () => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    try {
      await saveMutation.mutateAsync(form.getValues());
      toast.success('Travel information saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save travel information');
      return false;
    }
  };

  return (
    <WizardStepShell
      title="Travel Information"
      description="Step 4 of 7 — Tell us how and when you're arriving"
      icon={Route}
      form={form}
      onPersist={persist}
      previousStep={PREVIOUS_STEP}
      nextStep={NEXT_STEP}
      saveStatus={saveMutation.status}
      isSaving={saveMutation.isPending}
    >
      <WizardField label="Arrival Date" error={form.formState.errors.arrivalDate?.message}>
        <Input type="date" {...form.register('arrivalDate')} />
      </WizardField>

      <WizardField label="Departure Date" error={form.formState.errors.departureDate?.message}>
        <Input type="date" {...form.register('departureDate')} />
      </WizardField>

      <WizardField label="Mode of Travel" error={form.formState.errors.mode?.message}>
        <Select
          value={form.watch('mode')}
          onValueChange={(value) =>
            form.setValue('mode', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select mode of travel" />
          </SelectTrigger>
          <SelectContent>
            {TRAVEL_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </WizardField>

      <WizardField
        label="Expected Holy Bath Date"
        error={form.formState.errors.holyBathDate?.message}
      >
        <Input type="date" {...form.register('holyBathDate')} />
      </WizardField>

      <WizardField label="Vehicle Number" error={form.formState.errors.vehicleNumber?.message}>
        <Input {...form.register('vehicleNumber')} placeholder="Optional" />
      </WizardField>

      <WizardField label="Railway Station" error={form.formState.errors.railwayStation?.message}>
        <Input {...form.register('railwayStation')} placeholder="Optional" />
      </WizardField>

      <WizardField label="Bus Stand" error={form.formState.errors.busStand?.message}>
        <Input {...form.register('busStand')} placeholder="Optional" />
      </WizardField>
    </WizardStepShell>
  );
};

export default TravelInformationStep;
