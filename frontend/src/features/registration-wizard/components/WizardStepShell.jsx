import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AutosaveIndicator } from './AutosaveIndicator';
import { useWizardUiStore } from '@/store/useWizardUiStore';

// Shared shell for every single-form wizard step (Emergency/Medical/Travel/
// Accommodation): Card chrome + blur-autosave + Previous/Next footer.
// Step 1 (PersonalInformationStep) predates this and stays hand-written —
// see the increment 4 plan notes on why it isn't retrofitted. Family
// Members doesn't use this either since it's a CRUD list, not a form.
export const WizardStepShell = ({
  title,
  description,
  icon: Icon,
  form,
  onPersist,
  previousStep,
  nextStep,
  nextLabel,
  onNext,
  saveStatus,
  isSaving,
  children,
}) => {
  const setActiveStep = useWizardUiStore((state) => state.setActiveStep);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (form.formState.isDirty && saveStatus !== 'success') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form.formState.isDirty, saveStatus]);

  const handlePrevious = () => {
    if (previousStep) setActiveStep(previousStep.key);
  };

  const handleNext = async () => {
    if (onNext) {
      await onNext();
      return;
    }
    const saved = await onPersist();
    if (saved && nextStep) setActiveStep(nextStep.key);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="glass-card rounded-2xl border-none [--card-spacing:--spacing(4)] sm:rounded-[24px] sm:[--card-spacing:--spacing(6)] lg:[--card-spacing:--spacing(10)]">
        <CardHeader className="gap-2 sm:gap-3">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Step</p>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-11">
              <Icon className="size-5" />
            </span>
            <div>
              <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">{title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onBlur={onPersist}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {children}
          </form>
        </CardContent>
      </Card>

      <div className="mt-3 text-center sm:hidden">
        <AutosaveIndicator status={saveStatus} />
      </div>

      {/* Sticky action bar — Continue is always one thumb-reach away
          without hunting for it at the bottom of a long form. */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div>
          {previousStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="h-12 gap-2 rounded-2xl border-border/80 bg-background/80 px-5 text-sm font-semibold text-foreground shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 sm:h-[52px] sm:px-6"
            >
              <ArrowLeft className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" /> Back
            </Button>
          )}
        </div>
        <div className="hidden sm:block">
          <AutosaveIndicator status={saveStatus} />
        </div>
        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="h-12 flex-1 gap-1.5 rounded-2xl px-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--w-accent-hover)] sm:h-[52px] sm:flex-none"
        >
          {nextLabel || (nextStep ? `Save & Continue` : 'Continue')}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default WizardStepShell;
