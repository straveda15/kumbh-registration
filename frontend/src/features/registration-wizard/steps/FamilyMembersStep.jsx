import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { FamilyMemberTable } from '../components/FamilyMemberTable';
import { FamilyMemberCard } from '../components/FamilyMemberCard';
import { FamilyMemberFormDialog } from '../components/FamilyMemberFormDialog';
import { AutosaveIndicator } from '../components/AutosaveIndicator';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { WIZARD_STEP_META, REVIEW_STEP } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[4]; // Accommodation

export const FamilyMembersStep = ({ code, familyMembers = [] }) => {
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const { add, update, remove } = useFamilyMembers(code);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState(null);

  const openAddDialog = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const openEditDialog = (member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (values) => {
    try {
      if (editingMember) {
        await update.mutateAsync({ id: editingMember._id, payload: values });
        toast.success('Family member updated');
      } else {
        await add.mutateAsync(values);
        toast.success('Family member added');
      }
      return true;
    } catch (error) {
      toast.error(error.message || 'Could not save family member');
      return false;
    }
  };

  const confirmDelete = async () => {
    if (!memberPendingDelete) return;
    try {
      await remove.mutateAsync(memberPendingDelete._id);
      toast.success('Family member removed');
    } catch (error) {
      toast.error(error.message || 'Could not remove family member');
    } finally {
      setMemberPendingDelete(null);
    }
  };

  const isMutatingFamily =
    add.status === 'pending' || update.status === 'pending' || remove.status === 'pending';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Users className="size-4.5" />
              </span>
              <div>
                <CardTitle>Family Members</CardTitle>
                <CardDescription>
                  Step 6 of 7 — Add anyone travelling with you (optional)
                </CardDescription>
              </div>
            </div>
            <Button onClick={openAddDialog} size="sm" className="gap-1.5">
              <Plus className="size-4" /> Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {familyMembers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No family members added yet. This step is optional.
              </p>
            </div>
          ) : (
            <>
              <FamilyMemberTable
                members={familyMembers}
                onEdit={openEditDialog}
                onDelete={setMemberPendingDelete}
              />
              <FamilyMemberCard
                members={familyMembers}
                onEdit={openEditDialog}
                onDelete={setMemberPendingDelete}
              />
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveStep(PREVIOUS_STEP.key)}
            className="gap-1.5"
          >
            {PREVIOUS_STEP.label}
          </Button>
          <AutosaveIndicator status={isMutatingFamily ? 'pending' : 'idle'} />
        </div>
        <Button onClick={() => setActiveStep(REVIEW_STEP.key)} className="gap-1.5">
          Next: {REVIEW_STEP.label} <ArrowRight className="size-4" />
        </Button>
      </div>

      <FamilyMemberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingMember?.data}
        onSubmit={handleDialogSubmit}
        isSaving={add.isPending || update.isPending}
      />

      <AlertDialog
        open={Boolean(memberPendingDelete)}
        onOpenChange={(open) => !open && setMemberPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove family member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberPendingDelete?.data?.fullName || 'this family member'} from
              your registration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default FamilyMembersStep;
