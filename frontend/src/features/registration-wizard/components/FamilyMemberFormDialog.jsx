import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WizardField } from './WizardField';
import { familyMemberSchema, familyMemberDefaults } from '@/validators/familyMember.schema';

export const FamilyMemberFormDialog = ({ open, onOpenChange, initialData, onSubmit, isSaving }) => {
  const form = useForm({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: { ...familyMemberDefaults, ...initialData },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...familyMemberDefaults, ...initialData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const success = await onSubmit(values);
    if (success) onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
          <DialogDescription>
            Add details for a family member travelling with you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <WizardField label="Full Name" error={form.formState.errors.fullName?.message}>
            <Input {...form.register('fullName')} placeholder="Full name" />
          </WizardField>
          <WizardField label="Relationship" error={form.formState.errors.relationship?.message}>
            <Input {...form.register('relationship')} placeholder="e.g. Spouse, Child, Parent" />
          </WizardField>
          <WizardField label="Age" error={form.formState.errors.age?.message}>
            <Input type="number" min="0" max="120" {...form.register('age')} />
          </WizardField>
          <WizardField label="Gender" error={form.formState.errors.gender?.message}>
            <Select
              value={form.watch('gender')}
              onValueChange={(value) =>
                form.setValue('gender', value, { shouldValidate: true, shouldDirty: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </WizardField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {initialData ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyMemberFormDialog;
