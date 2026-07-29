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

  const arrivalValue = form.watch('arrivalDate');
  const departureValue = form.watch('departureDate');
  const holyBathValue = form.watch('holyBathDate');
  const minDepartureDate = arrivalValue || MIN_ARRIVAL_DATE;

  // Auto-clear Holy Bath Date if Arrival or Departure changes and out of range
  useEffect(() => {
    if (holyBathValue) {
      if (arrivalValue && holyBathValue < arrivalValue) {
        form.setValue('holyBathDate', '', { shouldValidate: true });
        toast.info('Expected Holy Bath Date cleared as it is before your new Arrival Date. Please select a new date.');
      } else if (departureValue && holyBathValue > departureValue) {
        form.setValue('holyBathDate', '', { shouldValidate: true });
        toast.info('Expected Holy Bath Date cleared as it is after your new Departure Date. Please select a new date.');
      }
    }
  }, [arrivalValue, departureValue, holyBathValue, form]);

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
      <WizardField label="Arrival Date *" error={form.formState.errors.arrivalDate?.message}>
        <Input
          className="h-14 px-4"
          type="date"
          min={MIN_ARRIVAL_DATE}
          {...form.register('arrivalDate')}
        />
      </WizardField>

      <WizardField label="Departure Date *" error={form.formState.errors.departureDate?.message}>
        <Input
          className="h-14 px-4"
          type="date"
          min={minDepartureDate}
          {...form.register('departureDate')}
        />
      </WizardField>

      <WizardField
        label="Expected Holy Bath Date *"
        error={form.formState.errors.holyBathDate?.message}
      >
        <Input
          className="h-14 px-4"
          type="date"
          min={arrivalValue || MIN_ARRIVAL_DATE}
          max={departureValue || undefined}
          {...form.register('holyBathDate')}
        />
      </WizardField>

      <WizardField label="Mode of Travel *" error={form.formState.errors.mode?.message}>
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

      {form.watch('mode') === 'Other' && (
        <WizardField
          label="Please specify your mode of travel"
          error={form.formState.errors.travelModeOther?.message}
        >
          <Input
            className="h-14 px-4"
            {...form.register('travelModeOther')}
            placeholder="Specify mode of travel"
          />
        </WizardField>
      )}

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
