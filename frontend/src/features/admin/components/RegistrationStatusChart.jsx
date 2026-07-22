import { useTheme } from 'next-themes';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getChartColors } from '@/utils/chartPalette';

// Maps onto the same buckets useAdminOverview already computes server-side
// (admin.service.js's getAnalyticsOverview) — draft is excluded there too,
// same rule the Registrations/Approvals admin pages apply (an unsubmitted
// registration isn't a real operational count).
const STATUS_META = [
  { key: 'approved', label: 'Approved', color: 'green' },
  { key: 'pending', label: 'Pending', color: 'blue' },
  { key: 'rejected', label: 'Rejected', color: 'red' },
  { key: 'infoRequested', label: 'Info Requested', color: 'magenta' },
  { key: 'suspended', label: 'Suspended', color: 'mutedText' },
];

// Donut — registration status is categorical, not a trend over time.
export const RegistrationStatusChart = ({ overview }) => {
  const { resolvedTheme } = useTheme();
  const colors = getChartColors(resolvedTheme);
  const rows = STATUS_META.map(({ key, label, color }) => ({
    key,
    label,
    value: overview?.[key] ?? 0,
    fill: colors[color],
  })).filter((row) => row.value > 0);

  if (rows.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No registrations yet.
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

export default RegistrationStatusChart;
