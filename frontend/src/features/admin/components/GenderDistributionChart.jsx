import { useTheme } from 'next-themes';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

const GENDER_COLOR_KEY = { male: 'blue', female: 'green', other: 'magenta' };

// Donut, not a line/area — gender is categorical (three discrete buckets),
// not a value that changes over a continuum. Identity is never carried by
// color alone (the "relief rule" for the magenta slot, which sits below
// 3:1 contrast on the light surface by design) — the legend and tooltip
// both show the label directly.
export const GenderDistributionChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  const rows = data.map((entry) => ({
    key: entry.gender,
    label: entry.gender ? entry.gender[0].toUpperCase() + entry.gender.slice(1) : 'Unknown',
    value: entry.count,
    fill: colors[GENDER_COLOR_KEY[entry.gender] || 'blue'],
  }));

  if (rows.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data yet.
      </p>
    );
  }

  return (
    <PieChart>
      <Pie data={rows} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
        {rows.map((row) => (
          <Cell key={row.key} fill={row.fill} />
        ))}
      </Pie>
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
    </PieChart>
  );
};

export default GenderDistributionChart;
