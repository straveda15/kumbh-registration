export const REGISTRATION_STATUS = Object.freeze({
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  INFO_REQUESTED: 'info_requested',
  SUSPENDED: 'suspended',
});

export const REGISTRATION_STATUS_VALUES = Object.values(REGISTRATION_STATUS);

export default REGISTRATION_STATUS;
