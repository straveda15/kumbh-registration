import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
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
      <Card className="glass-card rounded-2xl border-none [--card-spacing:--spacing(4)] sm:rounded-[24px] sm:[--card-spacing:--spacing(6)] lg:[--card-spacing:--spacing(10)]">
        <CardHeader className="gap-2 sm:gap-3">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Step</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-11">
                <Users className="size-5" />
              </span>
              <div>
                <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Family Members</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Add anyone travelling with you (optional).
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={openAddDialog}
              className="h-11 w-full gap-1.5 rounded-2xl px-4 hover:bg-[var(--w-accent-hover)] sm:w-auto"
            >
              <Plus className="size-4" /> Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {familyMembers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
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

      <div className="mt-3 text-center sm:hidden">
        <AutosaveIndicator status={isMutatingFamily ? 'pending' : 'idle'} />
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <Button
          variant="ghost"
          onClick={() => setActiveStep(PREVIOUS_STEP.key)}
          className="h-11 gap-1.5 rounded-2xl px-3 text-muted-foreground sm:px-4"
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="hidden sm:block">
          <AutosaveIndicator status={isMutatingFamily ? 'pending' : 'idle'} />
        </div>
        <Button
          onClick={() => setActiveStep(REVIEW_STEP.key)}
          className="h-12 flex-1 gap-1.5 rounded-2xl px-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--w-accent-hover)] sm:h-[52px] sm:flex-none"
        >
          Save & Continue <ArrowRight className="size-4" />
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
