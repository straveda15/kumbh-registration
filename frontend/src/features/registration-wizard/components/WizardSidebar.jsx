import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  UserRound,
  PhoneCall,
  HeartPulse,
  Route,
  BedDouble,
  Users,
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIZARD_STEP_META, REVIEW_STEP, isStepNavigable, areRequiredStepsComplete } from '@/utils/wizardSteps';

const STEP_ICONS = {
  personalInformation: UserRound,
  emergencyContact: PhoneCall,
  medicalInformation: HeartPulse,
  travelInformation: Route,
  accommodation: BedDouble,
  familyMembers: Users,
};

export const WizardSidebar = ({ stepStatus, activeStep, onSelectStep }) => (
  <motion.aside
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35 }}
    className="glass-panel h-fit w-full shrink-0 rounded-2xl p-4 md:sticky md:top-8 md:w-72"
  >
    <p className="px-2 pb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
      Registration Steps
    </p>
    <nav className="flex flex-col gap-1">
      {WIZARD_STEP_META.map(({ key, label }) => {
        const Icon = STEP_ICONS[key];
        const status = stepStatus?.[key] ?? 'pending';
        const isActive = activeStep === key;
        const isDone = status === 'completed' || status === 'skipped';
        const navigable = isStepNavigable(stepStatus ?? {}, key);

        return (
          <button
            key={key}
            type="button"
            disabled={!navigable}
            onClick={() => navigable && onSelectStep(key)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
              !navigable && 'cursor-not-allowed opacity-40',
              isActive
                ? 'bg-primary/15 text-foreground ring-1 ring-primary/40'
                : navigable && 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {isDone ? (
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
            ) : (
              <Circle className="size-3.5 shrink-0 text-muted-foreground/50" />
            )}
          </button>
        );
      })}

      {(() => {
        const navigable = areRequiredStepsComplete(stepStatus ?? {});
        const isActive = activeStep === REVIEW_STEP.key;
        return (
          <button
            type="button"
            disabled={!navigable}
            onClick={() => navigable && onSelectStep(REVIEW_STEP.key)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
              !navigable && 'cursor-not-allowed opacity-40',
              isActive
                ? 'bg-primary/15 text-foreground ring-1 ring-primary/40'
                : navigable && 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <ClipboardCheck className="size-4 shrink-0" />
            <span className="flex-1">{REVIEW_STEP.label}</span>
            <Circle className="size-3.5 shrink-0 text-muted-foreground/50" />
          </button>
        );
      })()}
    </nav>
  </motion.aside>
);

export default WizardSidebar;
