import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

const GENDER_COLOR_KEY = { male: 'blue', female: 'green', other: 'magenta' };

// Categorical proportions — identity carried by the axis label, never color
// alone; counts are direct-labeled (the "relief rule" for the magenta slot,
// which sits below 3:1 contrast on the light surface by design).
export const GenderDistributionChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  const rows = data.map((entry) => ({
    ...entry,
    label: entry.gender ? entry.gender[0].toUpperCase() + entry.gender.slice(1) : 'Unknown',
  }));

  return (
    <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 32, left: 8, bottom: 0 }}>
      <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" horizontal={false} />
      <XAxis
        type="number"
        allowDecimals={false}
        stroke={colors.axis}
        tick={{ fill: colors.mutedText, fontSize: 11 }}
        tickLine={false}
        axisLine={{ stroke: colors.axis }}
      />
      <YAxis
        type="category"
        dataKey="label"
        stroke={colors.axis}
        tick={{ fill: colors.mutedText, fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        width={64}
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
      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
        {rows.map((entry) => (
          <Cell key={entry.gender} fill={colors[GENDER_COLOR_KEY[entry.gender] || 'blue']} />
        ))}
        <LabelList dataKey="count" position="right" fill="var(--foreground)" fontSize={12} />
      </Bar>
    </BarChart>
  );
};

export default GenderDistributionChart;
