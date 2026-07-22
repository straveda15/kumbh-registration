import { useTheme } from 'next-themes';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

// Area, not a line — this is a shorter, more recent window than
// Registration Trend (see AdminDashboardPage), meant to emphasize
// day-to-day volume/magnitude rather than the broader trend direction.
export const DailyRegistrationsChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);

  return (
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <defs>
        <linearGradient id="dailyRegistrationsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors.blue} stopOpacity={0.35} />
          <stop offset="95%" stopColor={colors.blue} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
      <XAxis
        dataKey="date"
        stroke={colors.axis}
        tick={{ fill: colors.mutedText, fontSize: 11 }}
        tickLine={false}
        axisLine={{ stroke: colors.axis }}
      />
      <YAxis
        allowDecimals={false}
        stroke={colors.axis}
        tick={{ fill: colors.mutedText, fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        width={32}
      />
      <Tooltip
        contentStyle={{
          background: 'var(--popover)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: 12,
        }}
        labelStyle={{ color: 'var(--foreground)' }}
      />
      <Area
        type="monotone"
        dataKey="count"
        name="Registrations"
        stroke={colors.blue}
        strokeWidth={2}
        fill="url(#dailyRegistrationsFill)"
      />
    </AreaChart>
  );
};

export default DailyRegistrationsChart;
