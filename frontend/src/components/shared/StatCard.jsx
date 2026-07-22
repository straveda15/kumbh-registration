import { cn } from '@/lib/utils';

// Light-mode-only palette per tone — dark mode keeps its existing uniform
// primary-tinted circle (dark: overrides below) so this doesn't change
// anything about how the app already looks in dark mode, only adds status
// color-coding for the light theme.
const TONE_STYLES = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-primary/15 dark:text-primary',
  green: 'bg-green-100 text-green-600 dark:bg-primary/15 dark:text-primary',
  amber: 'bg-amber-100 text-amber-600 dark:bg-primary/15 dark:text-primary',
  red: 'bg-red-100 text-red-600 dark:bg-primary/15 dark:text-primary',
  purple: 'bg-purple-100 text-purple-600 dark:bg-primary/15 dark:text-primary',
};

// Lives in components/shared (rather than a role's feature folder) so it
// stays reusable by any future role-specific dashboard.
export const StatCard = ({ title, value, icon: Icon, trend, tone = 'blue', className }) => (
  <div
    className={cn(
      'glass-card flex flex-col gap-2 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
      className
    )}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{title}</p>
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-full',
          TONE_STYLES[tone] || TONE_STYLES.blue
        )}
      >
        <Icon className="size-4" />
      </span>
    </div>
    <p className="text-2xl font-semibold text-foreground">{value}</p>
    {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
  </div>
);

export default StatCard;
