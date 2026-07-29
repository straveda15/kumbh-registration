import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PhoneCall, UserCheck } from 'lucide-react';
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
      toast.success('Emergency contacts saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save emergency contacts');
      return false;
    }
  };

  return (
    <WizardStepShell
      title="Emergency Contacts"
      description="Step 2 of 7 — Who should we contact in an emergency?"
      icon={PhoneCall}
      form={form}
      onPersist={persist}
      previousStep={PREVIOUS_STEP}
      nextStep={NEXT_STEP}
      saveStatus={saveMutation.status}
      isSaving={saveMutation.isPending}
    >
      {/* ── Emergency Contact 1 (Mandatory) ── */}
      <div className="col-span-full flex flex-col gap-4 rounded-xl border border-border/60 bg-white/5 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <UserCheck className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Emergency Contact 1</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WizardField label="Contact Name *" error={form.formState.errors.contactName?.message}>
            <Input className="h-14 px-4" {...form.register('contactName')} placeholder="Full name" />
          </WizardField>

          <WizardField label="Relationship *" error={form.formState.errors.relationship?.message}>
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

          <WizardField label="Phone Number *" error={form.formState.errors.phone?.message}>
            <Input
              className="h-14 px-4"
              {...form.register('phone')}
              inputMode="numeric"
              maxLength={10}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
              placeholder="10-digit phone number"
            />
          </WizardField>

          <WizardField
            label="Alternative Phone (Optional)"
            error={form.formState.errors.alternativePhone?.message}
          >
            <Input
              className="h-14 px-4"
              {...form.register('alternativePhone')}
              inputMode="numeric"
              maxLength={10}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
              placeholder="Optional"
            />
          </WizardField>
        </div>
      </div>

      {/* ── Emergency Contact 2 (Mandatory) ── */}
      <div className="col-span-full flex flex-col gap-4 rounded-xl border border-border/60 bg-white/5 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <PhoneCall className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Emergency Contact 2</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WizardField label="Contact Name *" error={form.formState.errors.contactName2?.message}>
            <Input className="h-14 px-4" {...form.register('contactName2')} placeholder="Full name" />
          </WizardField>

          <WizardField label="Relationship *" error={form.formState.errors.relationship2?.message}>
            <Select
              value={form.watch('relationship2')}
              onValueChange={(value) =>
                form.setValue('relationship2', value, { shouldValidate: true, shouldDirty: true })
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

          <WizardField label="Phone Number *" error={form.formState.errors.phone2?.message}>
            <Input
              className="h-14 px-4"
              {...form.register('phone2')}
              inputMode="numeric"
              maxLength={10}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
              placeholder="10-digit phone number"
            />
          </WizardField>

          <WizardField
            label="Alternative Phone (Optional)"
            error={form.formState.errors.alternativePhone2?.message}
          >
            <Input
              className="h-14 px-4"
              {...form.register('alternativePhone2')}
              inputMode="numeric"
              maxLength={10}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
              placeholder="Optional"
            />
          </WizardField>
        </div>
      </div>
    </WizardStepShell>
  );
};

export default EmergencyContactStep;
