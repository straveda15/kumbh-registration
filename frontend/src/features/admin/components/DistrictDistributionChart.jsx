import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

// Horizontal bar — same layout as GenderDistributionChart used to be
// (district names as the Y-axis category), which reads far better than a
// vertical chart once labels are full place names rather than short words.
// Single series, so a single consistent color throughout is correct here —
// identity is carried entirely by the axis label, not by color.
export const DistrictDistributionChart = ({ data = [] }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  // Backend already sorts highest-first (top 10) — reverse so the biggest
  // bar renders at the top, matching how a ranked list naturally reads
  // (recharts' vertical layout otherwise renders top-to-bottom as
  // last-to-first).
  const rows = [...data].reverse();

  if (rows.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No data yet.
      </p>
    );
  }

  return (
    <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 36, left: 8, bottom: 0 }}>
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
        dataKey="district"
        stroke={colors.axis}
        tick={{ fill: colors.mutedText, fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        width={92}
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
      <Bar dataKey="count" name="Registrations" fill={colors.blue} radius={[0, 4, 4, 0]} barSize={16}>
        <LabelList dataKey="count" position="right" fill="var(--foreground)" fontSize={12} />
      </Bar>
    </BarChart>
  );
};

export default DistrictDistributionChart;
