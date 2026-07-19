// Frontend mirror of backend/src/constants/registrationStatus.js — display
// metadata the backend intentionally doesn't own.
export const REGISTRATION_STATUS_META = {
  draft: { label: 'Draft', badgeVariant: 'secondary' },
  submitted: { label: 'Submitted', badgeVariant: 'outline' },
  approved: { label: 'Approved', badgeVariant: 'default' },
  rejected: { label: 'Rejected', badgeVariant: 'destructive' },
  cancelled: { label: 'Cancelled', badgeVariant: 'destructive' },
  info_requested: { label: 'Info Requested', badgeVariant: 'outline' },
  suspended: { label: 'Suspended', badgeVariant: 'destructive' },
};

export const getRegistrationStatusMeta = (status) =>
  REGISTRATION_STATUS_META[status] ?? { label: status ?? 'Unknown', badgeVariant: 'outline' };

export default REGISTRATION_STATUS_META;
