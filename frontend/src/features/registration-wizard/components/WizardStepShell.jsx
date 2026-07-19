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
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="size-4.5" />
            </span>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onBlur={onPersist}
            onSubmit={(event) => event.preventDefault()}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {children}
          </form>
        </CardContent>
      </Card>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {previousStep && (
            <Button variant="outline" onClick={handlePrevious} className="gap-1.5">
              <ArrowLeft className="size-4" /> {previousStep.label}
            </Button>
          )}
          <AutosaveIndicator status={saveStatus} />
        </div>
        <Button onClick={handleNext} disabled={isSaving} className="gap-1.5">
          {nextLabel || (nextStep ? `Next: ${nextStep.label}` : 'Continue')}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default WizardStepShell;
