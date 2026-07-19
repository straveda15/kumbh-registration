import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

const reshape = (data) => {
  const byDate = new Map();
  data.forEach(({ date, status, count }) => {
    if (!byDate.has(date)) byDate.set(date, { date, approved: 0, rejected: 0 });
    byDate.get(date)[status] = count;
  });
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// Two series (approved/rejected) — fixed color assignment (blue=approved,
// red=rejected), always a legend since there's more than one series.
export const ApprovalTrendChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  const rows = useMemo(() => reshape(data), [data]);

  return (
    <LineChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Line type="monotone" dataKey="approved" name="Approved" stroke={colors.blue} strokeWidth={2} dot={{ r: 3 }} />
      <Line type="monotone" dataKey="rejected" name="Rejected" stroke={colors.red} strokeWidth={2} dot={{ r: 3 }} />
    </LineChart>
  );
};

export default ApprovalTrendChart;
