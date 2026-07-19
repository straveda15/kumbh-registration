import { cn } from '@/lib/utils';

// Role-agnostic — used by both the Admin dashboard and the Operator
// dashboard, hence living in components/shared rather than under either
// role's feature folder.
export const StatCard = ({ title, value, icon: Icon, trend, className }) => (
  <div className={cn('glass-card flex flex-col gap-2 rounded-2xl p-5', className)}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{title}</p>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-4" />
      </span>
    </div>
    <p className="text-2xl font-semibold text-foreground">{value}</p>
    {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
  </div>
);

export default StatCard;
