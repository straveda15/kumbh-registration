import { useEffect } from 'react';
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
  getMinArrivalDate,
} from '@/validators/travelInformation.schema';
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[2]; // Medical Information
const NEXT_STEP = WIZARD_STEP_META[4]; // Accommodation

// Local (not UTC) YYYY-MM-DD, matching what <input type="date"> both
// expects and produces — toISOString() would shift near midnight in
// timezones ahead of UTC.
const toDateInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const MIN_ARRIVAL_DATE = toDateInputValue(getMinArrivalDate());

export const TravelInformationStep = ({ code, initialData }) => {
  const saveMutation = useSaveWizardStep(code, saveTravelInformation);
  const setLiveSection = useWizardLiveDraftStore((state) => state.setLiveSection);

  const form = useForm({
    resolver: zodResolver(travelInformationSchema),
    defaultValues: { ...travelInformationDefaults, ...initialData },
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = form.watch((values) => setLiveSection('travelInformation', values));
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Departure's floor tracks whatever arrival is currently set to — arrival
  // itself can never go earlier than tomorrow (MIN_ARRIVAL_DATE).
  const arrivalValue = form.watch('arrivalDate');
  const minDepartureDate = arrivalValue || MIN_ARRIVAL_DATE;

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
        <Input
          className="h-14 px-4"
          type="date"
          min={MIN_ARRIVAL_DATE}
          {...form.register('arrivalDate')}
        />
      </WizardField>

      <WizardField label="Departure Date" error={form.formState.errors.departureDate?.message}>
        <Input
          className="h-14 px-4"
          type="date"
          min={minDepartureDate}
          {...form.register('departureDate')}
        />
      </WizardField>

      <WizardField label="Mode of Travel" error={form.formState.errors.mode?.message}>
        <Select
          value={form.watch('mode')}
          onValueChange={(value) =>
            form.setValue('mode', value, { shouldValidate: true, shouldDirty: true })
          }
        >
          <SelectTrigger className="h-14 w-full px-4">
            <SelectValue placeholder="Select Mode of Travel" />
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
        <Input className="h-14 px-4" type="date" {...form.register('holyBathDate')} />
      </WizardField>

      {form.watch('mode') === 'Private Vehicle' && (
        <WizardField label="Vehicle Number" error={form.formState.errors.vehicleNumber?.message}>
          <Input className="h-14 px-4" {...form.register('vehicleNumber')} placeholder="Optional" />
        </WizardField>
      )}

      <WizardField label="Railway Station" error={form.formState.errors.railwayStation?.message}>
        <Input className="h-14 px-4" {...form.register('railwayStation')} placeholder="Optional" />
      </WizardField>

      <WizardField label="Bus Stand" error={form.formState.errors.busStand?.message}>
        <Input className="h-14 px-4" {...form.register('busStand')} placeholder="Optional" />
      </WizardField>
    </WizardStepShell>
  );
};

export default TravelInformationStep;
