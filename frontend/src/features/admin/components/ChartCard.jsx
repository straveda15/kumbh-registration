import { ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const ChartCard = ({ title, children, height = 260, className }) => (
  // min-w-0 overrides the grid item's default min-width: auto — without
  // it, a CSS grid column can't shrink below the chart SVG's natural
  // content width, so ResponsiveContainer never actually gets to constrain
  // it and the card (and the whole row) overflows horizontally on narrow
  // screens instead of the chart just redrawing smaller.
  <Card className={cn('glass-card min-w-0 overflow-hidden border-none', className)}>
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent className="min-w-0">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default ChartCard;
