import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { TriangleAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WizardLayout } from '@/layouts/WizardLayout';
import { PersonalInformationStep } from '@/features/registration-wizard/steps/PersonalInformationStep';
import { EmergencyContactStep } from '@/features/registration-wizard/steps/EmergencyContactStep';
import { MedicalInformationStep } from '@/features/registration-wizard/steps/MedicalInformationStep';
import { TravelInformationStep } from '@/features/registration-wizard/steps/TravelInformationStep';
import { AccommodationStep } from '@/features/registration-wizard/steps/AccommodationStep';
import { FamilyMembersStep } from '@/features/registration-wizard/steps/FamilyMembersStep';
import { ReviewStep } from '@/features/registration-wizard/steps/ReviewStep';
import { useStartOrResumeDraft } from '@/features/registration-wizard/hooks/useStartOrResumeDraft';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { areRequiredStepsComplete } from '@/utils/wizardSteps';

const WizardSkeleton = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:px-8">
    <Skeleton className="h-96 w-full shrink-0 rounded-2xl md:w-72" />
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </div>
);

export const WizardPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: draft, isPending, isError, error, refetch } = useStartOrResumeDraft(code);
  const activeStep = useWizardUiStore((state) => state.activeStep);
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);

  // Defense in depth: a submitted registration's mutation routes are
  // already rejected server-side (assertDraftEditable), but a citizen
  // shouldn't even see the wizard form after submitting — send them to
  // their dashboard instead.
  useEffect(() => {
    if (draft?.registrationStatus && draft.registrationStatus !== 'draft') {
      navigate('/dashboard', { replace: true });
    }
  }, [draft?.registrationStatus, navigate]);

  // Deep-link support: ProfilePage's "Edit" buttons navigate here with
  // { state: { step } }. Runs after WizardLayout's own mount-sync effect
  // (parent effects fire after child effects), so it correctly wins.
  useEffect(() => {
    if (location.state?.step) {
      setActiveStep(location.state.step);
    }
  }, [location.state?.step, setActiveStep]);

  if (isPending) {
    return <WizardSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4">
        <div className="glass-panel flex max-w-md flex-col items-center gap-3 rounded-2xl px-8 py-10 text-center">
          <TriangleAlert className="size-8 text-destructive" />
          <p className="text-base font-medium text-foreground">We couldn't start your registration</p>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'This QR code may be invalid, expired, or already used.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 gap-1.5">
            <RotateCcw className="size-3.5" /> Try again
          </Button>
        </div>
      </div>
    );
  }

  if (draft?.registrationStatus && draft.registrationStatus !== 'draft') {
    return null;
  }

  const canSubmit = areRequiredStepsComplete(draft?.stepStatus);

  return (
    <WizardLayout draft={draft}>
      {activeStep === 'personalInformation' && (
        <PersonalInformationStep code={code} initialData={draft?.personalInformation?.data ?? {}} />
      )}
      {activeStep === 'emergencyContact' && (
        <EmergencyContactStep code={code} initialData={draft?.emergencyContact?.data ?? {}} />
      )}
      {activeStep === 'medicalInformation' && (
        <MedicalInformationStep code={code} initialData={draft?.medicalProfile?.data ?? {}} />
      )}
      {activeStep === 'travelInformation' && (
        <TravelInformationStep code={code} initialData={draft?.travelInformation?.data ?? {}} />
      )}
      {activeStep === 'accommodation' && (
        <AccommodationStep code={code} initialData={draft?.accommodation?.data ?? {}} />
      )}
      {activeStep === 'familyMembers' && (
        <FamilyMembersStep code={code} familyMembers={draft?.familyMembers ?? []} />
      )}
      {activeStep === 'review' && <ReviewStep code={code} draft={draft} canSubmit={canSubmit} />}
    </WizardLayout>
  );
};

export default WizardPage;
