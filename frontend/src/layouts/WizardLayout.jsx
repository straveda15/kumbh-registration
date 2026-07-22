import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import { WizardStepper } from '@/features/registration-wizard/components/WizardStepper';
import { LivePreviewPanel } from '@/features/registration-wizard/components/LivePreviewPanel';
import { MobileRegistrationSummary } from '@/features/registration-wizard/components/MobileRegistrationSummary';
import { useWizardUiStore } from '@/store/useWizardUiStore';

export const WizardLayout = ({ draft, children }) => {
  const navigate = useNavigate();
  const activeStep = useWizardUiStore((state) => state.activeStep);
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);
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

  // Radix Dialog/Select/Popover content is teleported via a Portal to
  // document.body — outside this component's own DOM subtree — so the
  // `.wizard-theme` class on the wrapper div below never reaches it (CSS
  // custom properties only inherit down the actual DOM tree, not through
  // React's render tree). Toggling the same class on <body> while the
  // wizard is mounted gives every portaled dropdown/dialog/popover a
  // shared ancestor with the wizard's theme vars, so they pick up the
  // premium palette instead of falling back to the app's default theme.
  useEffect(() => {
    document.body.classList.add('wizard-theme');
    return () => document.body.classList.remove('wizard-theme');
  }, []);

  // Switching steps is a Zustand state change, not a route change, so
  // nothing else scrolls the page back to the top automatically — without
  // this, finishing a long step at the bottom of the screen would drop a
  // pilgrim into the middle of the next one instead of at its first field.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  return (
    <div className="wizard-theme wizard-bg min-h-screen w-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:gap-5 md:px-8 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <QrCode className="size-4" />
            </span>
            <span className="hidden sm:inline">Kumbh Registration</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <span className="hidden sm:inline">Already Registered?</span>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="h-9 rounded-full border-primary px-4 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Login
              </Button>
            </div>

            <ThemeSwitcher className="w-auto" />
          </div>
        </div>

        <WizardStepper activeStep={activeStep} stepStatus={draft?.stepStatus} onSelectStep={setActiveStep} />

        {/* Mobile-only Profile Preview, sitting between the stepper and the
            form itself so a pilgrim can verify what they've entered before
            scrolling into the current step — always visible, not
            collapsible, same as the desktop sidebar. Desktop gets this same
            live-updating data via the always-visible LivePreviewPanel
            sidebar below, so it stays hidden there instead of showing
            twice. */}
        <div className="lg:hidden">
          <MobileRegistrationSummary draft={draft} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex min-w-0 flex-col gap-6">{children}</div>
          {/* The live preview is a nice-to-have on a wide screen, not
              essential to filling out the form — hiding it on narrow
              viewports keeps each step short enough to complete one-handed
              instead of adding a second card's worth of scrolling first.
              Its data is still available on mobile via the
              MobileRegistrationSummary card above instead of being lost. */}
          <div className="hidden lg:block">
            <LivePreviewPanel draft={draft} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
