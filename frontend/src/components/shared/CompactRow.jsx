// Compact label/value row used across the redesigned mobile-first citizen
// portal (Dashboard, Profile) — half the visual weight of the old
// SummaryCard/DataRow pattern.
export const CompactRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="max-w-[60%] truncate text-right font-medium text-foreground">{value || '—'}</span>
  </div>
);

export default CompactRow;
