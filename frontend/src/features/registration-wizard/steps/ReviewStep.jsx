import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardCheck, Loader2, Send, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileSummaryCard } from '@/features/dashboard/components/ProfileSummaryCard';
import { EmergencyContactSummaryCard } from '@/features/dashboard/components/EmergencyContactSummaryCard';
import { MedicalSummaryCard } from '@/features/dashboard/components/MedicalSummaryCard';
import { TravelSummaryCard } from '@/features/dashboard/components/TravelSummaryCard';
import { AccommodationSummaryCard } from '@/features/dashboard/components/AccommodationSummaryCard';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { FamilyMemberTable } from '../components/FamilyMemberTable';
import { FamilyMemberCard } from '../components/FamilyMemberCard';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { useSubmitRegistration } from '../hooks/useSubmitRegistration';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { WIZARD_STEP_META } from '@/utils/wizardSteps';

const PREVIOUS_STEP = WIZARD_STEP_META[WIZARD_STEP_META.length - 1]; // Family Members
const PERSONAL_STEP = WIZARD_STEP_META[0];

// Read-only recap of everything entered so far, reusing the same summary
// cards the citizen dashboard's ProfilePage shows post-submit — one set of
// display components for both "review before submit" and "view after
// submit" instead of two copies of the same field-reading JSX.
export const ReviewStep = ({ code, draft, canSubmit }) => {
  const navigate = useNavigate();
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const submitMutation = useSubmitRegistration(code);

  const familyMembers = draft?.familyMembers ?? [];

  const handleSubmitRegistration = async () => {
    try {
      const result = await submitMutation.mutateAsync();
      navigate('/register/success', {
        state: { registrationNumber: result.registrationNumber, pilgrimId: result.pilgrimId },
      });
    } catch (error) {
      // The backend only rejects submit for a missing account password
      // this late (see registration.service.js's submitRegistration) — a
      // pilgrim who skipped setting one on Personal Information otherwise
      // sails through every other step with no signal anything's missing.
      // Send them right back there instead of leaving a generic toast as
      // the only clue.
      if (error.errors?.[0]?.field === 'password') {
        setActiveStep(PERSONAL_STEP.key);
      }
      toast.error(error.message || 'Could not submit registration');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <ClipboardCheck className="size-4.5" />
            </span>
            <div>
              <CardTitle>Review &amp; Submit</CardTitle>
              <CardDescription>Step 7 of 7 — Check everything before you submit</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ProfileSummaryCard data={draft?.personalInformation?.data} detailed />
          <EmergencyContactSummaryCard data={draft?.emergencyContact?.data} />
          <MedicalSummaryCard data={draft?.medicalProfile?.data} detailed />
          <TravelSummaryCard data={draft?.travelInformation?.data} detailed />
          <AccommodationSummaryCard data={draft?.accommodation?.data} />

          <SummaryCard title="Family Members" icon={UserRound} className="sm:col-span-2">
            {familyMembers.length === 0 ? (
              <p className="text-xs text-muted-foreground">No family members were added.</p>
            ) : (
              <>
                <FamilyMemberTable members={familyMembers} />
                <FamilyMemberCard members={familyMembers} />
              </>
            )}
          </SummaryCard>
        </CardContent>
      </Card>

      <Card className="glass-card mt-5 border-none">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Upload your profile photo and government ID before submitting.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DocumentUploadCard type="profilePhoto" />
          <DocumentUploadCard type="governmentId" />
        </CardContent>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setActiveStep(PREVIOUS_STEP.key)} className="gap-1.5">
          {PREVIOUS_STEP.label}
        </Button>
        <Button
          onClick={handleSubmitRegistration}
          disabled={!canSubmit || submitMutation.isPending}
          className="gap-1.5"
        >
          {submitMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Submit Registration
        </Button>
      </div>

      {!canSubmit && (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          Complete all required steps before submitting.
        </p>
      )}
    </motion.div>
  );
};

export default ReviewStep;
