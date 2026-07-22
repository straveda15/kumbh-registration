import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WIZARD_STEP_META,
  REVIEW_STEP,
  isStepNavigable,
  areRequiredStepsComplete,
} from '@/utils/wizardSteps';

const STEP_SHORT_LABELS = {
  personalInformation: 'Personal',
  emergencyContact: 'Emergency',
  medicalInformation: 'Medical',
  travelInformation: 'Travel',
  accommodation: 'Accommodation',
  familyMembers: 'Family',
  review: 'Review',
};

const ALL_STEPS = [...WIZARD_STEP_META, REVIEW_STEP];

// Numbered step indicator (matches the pre-redesign UI's design language) —
// every step is always visible with its number/title so a pilgrim can see
// what's done, what's active, and what's left at a glance, instead of a
// bare "Step X of Y" bar. All steps render in one row at every breakpoint;
// on narrow screens the row simply overflows into a horizontal scroller
// rather than wrapping or getting replaced with a different layout.
export const WizardStepper = ({ activeStep, stepStatus = {}, onSelectStep }) => {
  const requiredComplete = areRequiredStepsComplete(stepStatus);

  return (
    <div className="glass-card overflow-x-auto rounded-2xl border-none px-2 py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:rounded-[24px] sm:px-4 [&::-webkit-scrollbar]:hidden">
      <ol className="flex w-max items-center gap-0.5 sm:gap-1.5">
        {ALL_STEPS.map((step, index) => {
          const isReview = step.key === 'review';
          const isActive = activeStep === step.key;
          const isCompleted =
            !isReview && (stepStatus[step.key] === 'completed' || stepStatus[step.key] === 'skipped');
          const isNavigable = isReview ? requiredComplete : isStepNavigable(stepStatus, step.key);
          const isLast = index === ALL_STEPS.length - 1;

          return (
            <li key={step.key} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => isNavigable && onSelectStep?.(step.key)}
                disabled={!isNavigable}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-1.5 py-1.5 text-center transition-colors sm:px-2.5',
                  isNavigable ? 'cursor-pointer hover:bg-muted/60' : 'cursor-not-allowed opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors sm:size-9',
                    isActive && 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30',
                    !isActive && isCompleted && 'border-primary/60 bg-primary/15 text-primary',
                    !isActive && !isCompleted && 'border-border bg-transparent text-muted-foreground'
                  )}
                >
                  {isCompleted && !isActive ? <Check className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium whitespace-nowrap sm:text-xs',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {STEP_SHORT_LABELS[step.key]}
                </span>
              </button>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-0.5 h-0.5 w-4 shrink-0 rounded-full sm:mx-1.5 sm:w-10',
                    isCompleted ? 'bg-primary/60' : 'bg-border'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default WizardStepper;
