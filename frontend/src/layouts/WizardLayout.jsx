import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WizardSidebar } from '@/features/registration-wizard/components/WizardSidebar';
import { WizardProgressBar } from '@/features/registration-wizard/components/WizardProgressBar';
import { useWizardUiStore } from '@/store/useWizardUiStore';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';

export const WizardLayout = ({ draft, children }) => {
  const navigate = useNavigate();
  const activeStep = useWizardUiStore((state) => state.activeStep);
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
  const clearSession = useDraftSessionStore((state) => state.clearSession);
  const syncedRegistrationIdRef = useRef(null);

  // Jump the sidebar to whatever step the server says is next, but only
  // once per registrationId (on first load/resume) — not on every draft
  // refetch, which would otherwise yank a citizen away from a step they're
  // deliberately revisiting the moment any autosave elsewhere completes.
  useEffect(() => {
    if (
      draft?.registrationId &&
      draft.currentStep &&
      syncedRegistrationIdRef.current !== draft.registrationId
    ) {
      setActiveStep(draft.currentStep);
      syncedRegistrationIdRef.current = draft.registrationId;
    }
  }, [draft?.registrationId, draft?.currentStep, setActiveStep]);

  const handleExit = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-8 md:px-8">
      <WizardSidebar
        stepStatus={draft?.stepStatus}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />
      <div className="flex flex-1 flex-col gap-6">
        <div className="glass-panel flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
          <WizardProgressBar percentage={draft?.completionPercentage ?? 0} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="gap-1.5 text-muted-foreground"
          >
            <LogOut className="size-4" /> Exit
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default WizardLayout;
