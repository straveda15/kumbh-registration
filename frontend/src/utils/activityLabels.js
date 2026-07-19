// Shared by the citizen Registration Timeline card and the admin recent
// activity feed — one label map instead of two.
export const ACTIVITY_ACTION_LABELS = {
  'registration.started': 'Registration started',
  'registration.step_saved': 'Autosave',
  'registration.family_member_added': 'Family member added',
  'registration.family_member_updated': 'Family member updated',
  'registration.family_member_removed': 'Family member removed',
  'registration.submitted': 'Registration submitted',
  'registration.pass_generated': 'Digital pass generated',
  'registration.approved': 'Registration approved',
  'registration.rejected': 'Registration rejected',
  'registration.info_requested': 'More information requested',
  'registration.suspended': 'Registration suspended',
  'registration.restored': 'Registration restored',
  'registration.deleted': 'Registration deleted',
  'operator.entry_approved': 'Gate entry approved',
  'operator.entry_rejected': 'Gate entry rejected',
};

export const getActivityLabel = (action) => ACTIVITY_ACTION_LABELS[action] || action;

export default ACTIVITY_ACTION_LABELS;
