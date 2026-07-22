import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Rolls the daily registrationTrend series (see AdminDashboardPage's
// year-long fetch) up into calendar months — the backend only aggregates
// by day, so a "monthly" view is a client-side sum over that same real
// per-day data rather than a separate endpoint.
const groupByMonth = (data) => {
  const byMonth = new Map();
  data.forEach(({ date, count }) => {
    const monthKey = date.slice(0, 7); // "YYYY-MM"
    byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + count);
  });
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [year, month] = key.split('-');
      return { month: `${MONTH_LABELS[Number(month) - 1]} '${year.slice(2)}`, count };
    });
};

// Column chart — months are discrete categories, not a continuum, so
// distinct bars (not a line) are the appropriate encoding.
export const MonthlyRegistrationsChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  const rows = useMemo(() => groupByMonth(data), [data]);

  return (
    <BarChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
      <XAxis
        dataKey="month"
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
        cursor={{ fill: 'var(--muted)' }}
        contentStyle={{
          background: 'var(--popover)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: 12,
        }}
        labelStyle={{ color: 'var(--foreground)' }}
      />
      <Bar dataKey="count" name="Registrations" fill={colors.blue} radius={[4, 4, 0, 0]} barSize={28} />
    </BarChart>
  );
};

export default MonthlyRegistrationsChart;
