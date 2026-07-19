import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

// Single series — no legend box needed, the ChartCard title names it.
export const RegistrationTrendChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);

  return (
    <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
      <Line
        type="monotone"
        dataKey="count"
        name="Registrations"
        stroke={colors.blue}
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 5 }}
      />
    </LineChart>
  );
};

export default RegistrationTrendChart;
