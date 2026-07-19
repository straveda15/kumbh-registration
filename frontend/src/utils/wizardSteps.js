// Frontend mirror of backend/src/constants/wizardSteps.js — same 6 fixed
// step keys, plus the display labels the backend intentionally doesn't own.
export const WIZARD_STEP_META = [
  { key: 'personalInformation', label: 'Personal Information' },
  { key: 'emergencyContact', label: 'Emergency Contact' },
  { key: 'medicalInformation', label: 'Medical Information' },
  { key: 'travelInformation', label: 'Travel Information' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'familyMembers', label: 'Family Members' },
];

export const WIZARD_STEP_ORDER = WIZARD_STEP_META.map((step) => step.key);

// Mirrors backend REQUIRED_STEPS (registration.service.js) — familyMembers
// is optional and doesn't block submit.
export const REQUIRED_STEP_KEYS = WIZARD_STEP_ORDER.filter((key) => key !== 'familyMembers');

export const areRequiredStepsComplete = (stepStatus = {}) =>
  REQUIRED_STEP_KEYS.every((key) => stepStatus[key] === 'completed' || stepStatus[key] === 'skipped');

// Review & Submit isn't a data-entry step — it has no backend stepStatus of
// its own, it's just the UI destination reachable once every required step
// above is done. Kept out of WIZARD_STEP_META/WIZARD_STEP_ORDER so it never
// participates in areRequiredStepsComplete/isStepNavigable's step-status math.
export const REVIEW_STEP = { key: 'review', label: 'Review & Submit' };

// A step is reachable if it's already completed/skipped, or it's the
// earliest still-pending step — prevents jumping past multiple unfinished
// steps while still allowing free revisiting of anything already done.
export const isStepNavigable = (stepStatus = {}, stepKey) => {
  const status = stepStatus[stepKey];
  if (status === 'completed' || status === 'skipped') return true;

  const firstPendingKey = WIZARD_STEP_ORDER.find((key) => stepStatus[key] === 'pending');
  return firstPendingKey === stepKey;
};

export default WIZARD_STEP_META;
