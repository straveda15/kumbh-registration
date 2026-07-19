import { Progress } from '@/components/ui/progress';

export const WizardProgressBar = ({ percentage = 0 }) => (
  <div className="flex flex-1 items-center gap-3">
    <div className="flex-1">
      <Progress value={percentage} />
    </div>
    <span className="w-12 shrink-0 text-right text-sm font-medium text-foreground">
      {percentage}%
    </span>
  </div>
);

export default WizardProgressBar;
