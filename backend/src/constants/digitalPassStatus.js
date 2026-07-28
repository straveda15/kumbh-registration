export const DIGITAL_PASS_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  REVOKED: 'revoked',
});

export const DIGITAL_PASS_STATUS_VALUES = Object.values(DIGITAL_PASS_STATUS);

export const VERIFICATION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

export const VERIFICATION_STATUS_VALUES = Object.values(VERIFICATION_STATUS);

export default DIGITAL_PASS_STATUS;

