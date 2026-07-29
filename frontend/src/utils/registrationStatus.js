// Frontend mirror of backend/src/constants/registrationStatus.js — display
// metadata the backend intentionally doesn't own.
export const REGISTRATION_STATUS_META = {
  draft: { label: 'Draft', badgeVariant: 'secondary' },
  submitted: { label: 'Pending Verification', badgeVariant: 'warning' },
  pending: { label: 'Pending Verification', badgeVariant: 'warning' },
  approved: { label: 'Approved', badgeVariant: 'success' },
  rejected: { label: 'Rejected', badgeVariant: 'destructive' },
  cancelled: { label: 'Cancelled', badgeVariant: 'destructive' },
  info_requested: { label: 'Info Requested', badgeVariant: 'outline' },
  suspended: { label: 'Suspended', badgeVariant: 'destructive' },
};

export const getRegistrationStatusMeta = (status) => {
  const key = typeof status === 'string' ? status.toLowerCase() : status;
  if (key === 'submitted' || key === 'pending') {
    return { label: 'Pending', badgeVariant: 'warning' };
  }
  if (key === 'approved') {
    return { label: 'Approved', badgeVariant: 'success' };
  }
  if (key === 'rejected') {
    return { label: 'Rejected', badgeVariant: 'destructive' };
  }
  return REGISTRATION_STATUS_META[key] ?? { label: status ? String(status) : 'Pending', badgeVariant: 'warning' };
};

export default REGISTRATION_STATUS_META;
