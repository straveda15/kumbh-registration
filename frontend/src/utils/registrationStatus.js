// Frontend mirror of backend/src/constants/registrationStatus.js — display
// metadata the backend intentionally doesn't own.
export const REGISTRATION_STATUS_META = {
  // 'secondary' resolves to a light-blue badge via the theme's --secondary
  // token — matches the "Draft: Blue" badge convention.
  draft: { label: 'Draft', badgeVariant: 'secondary' },
  // 'submitted' is this app's "awaiting review" state — the "Pending:
  // Amber" badge convention.
  submitted: { label: 'Submitted', badgeVariant: 'warning' },
  approved: { label: 'Approved', badgeVariant: 'success' },
  rejected: { label: 'Rejected', badgeVariant: 'destructive' },
  cancelled: { label: 'Cancelled', badgeVariant: 'destructive' },
  info_requested: { label: 'Info Requested', badgeVariant: 'outline' },
  suspended: { label: 'Suspended', badgeVariant: 'destructive' },
};

export const getRegistrationStatusMeta = (status) =>
  REGISTRATION_STATUS_META[status] ?? { label: status ?? 'Unknown', badgeVariant: 'outline' };

export default REGISTRATION_STATUS_META;
