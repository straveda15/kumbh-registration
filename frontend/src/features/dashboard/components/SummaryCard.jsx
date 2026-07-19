import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const SummaryCard = ({ title, icon: Icon, children, action, className }) => (
  <Card className={`glass-card border-none ${className ?? ''}`}>
    <CardHeader>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon className="size-4" />
          </span>
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
        {action}
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm">{children}</CardContent>
  </Card>
);

export const DataRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="max-w-[60%] truncate text-right font-medium text-foreground">
      {value || '—'}
    </span>
  </div>
);

export default SummaryCard;
