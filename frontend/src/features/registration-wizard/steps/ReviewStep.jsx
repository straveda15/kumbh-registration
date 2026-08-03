import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardCheck, Loader2, Send, UserRound } from 'lucide-react';
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
      // The wizard's own draft token still grants dashboard access post-
      // submit (see useHasCitizenSession) — no separate login step needed
      // before landing there. The freshly generated Registration Number is
      // handed forward via route state so the dashboard can show it once in
      // a success banner; after that it's still visible any time on the
      // Dashboard and Profile pages (see RegistrationNumberCard).
      navigate('/dashboard', {
        state: { justRegistered: true, registrationNumber: result.registrationNumber },
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
      <Card className="glass-card rounded-2xl border-none [--card-spacing:--spacing(4)] sm:rounded-[24px] sm:[--card-spacing:--spacing(6)] lg:[--card-spacing:--spacing(10)]">
        <CardHeader className="gap-2 sm:gap-3">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Step</p>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-11">
              <ClipboardCheck className="size-5" />
            </span>
            <div>
              <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Review &amp; Submit</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Check everything before you submit.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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

      <Card className="glass-card mt-4 rounded-2xl border-none [--card-spacing:--spacing(4)] sm:mt-5 sm:rounded-[24px] sm:[--card-spacing:--spacing(6)] lg:[--card-spacing:--spacing(10)]">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Documents</CardTitle>
          <CardDescription>
            Upload your government ID before submitting. Your profile photo is uploaded from the
            Personal Information step.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DocumentUploadCard type="governmentId" />
        </CardContent>
      </Card>

      {!canSubmit && (
        <p className="mt-3 text-center text-xs text-muted-foreground sm:text-right">
          Complete all required steps before submitting.
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveStep(PREVIOUS_STEP.key)}
          className="h-12 gap-2 rounded-2xl border-border/80 bg-background/80 px-5 text-sm font-semibold text-foreground shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 sm:h-[52px] sm:px-6"
        >
          <ArrowLeft className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" /> Back
        </Button>
        <Button
          onClick={handleSubmitRegistration}
          disabled={!canSubmit || submitMutation.isPending || submitMutation.isSuccess}
          className="h-12 flex-1 gap-1.5 rounded-2xl px-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--w-accent-hover)] sm:h-[52px] sm:flex-none"
        >
          {submitMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Submit Registration
        </Button>
      </div>
    </motion.div>
  );
};

export default ReviewStep;
