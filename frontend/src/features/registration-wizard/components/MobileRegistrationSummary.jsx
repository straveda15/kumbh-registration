import { RegistrationPreviewFields } from './RegistrationPreviewFields';

// Mobile counterpart to the desktop LivePreviewPanel sidebar (hidden below
// `lg`, see WizardLayout) — same live-updating "Profile Preview" content via
// RegistrationPreviewFields (photo, name, gender/age/language, mobile,
// district, blood group, arrival, accommodation, family count). Deliberately
// NOT collapsible — a pilgrim should be able to verify what they've entered
// at a glance, the same way the desktop sidebar is always visible too.
export const MobileRegistrationSummary = ({ draft }) => (
  <div className="glass-card rounded-2xl border-none p-4">
    <p className="mb-3 text-xs font-semibold tracking-wider text-[var(--w-muted)] uppercase">
      Profile Preview
    </p>
    <RegistrationPreviewFields draft={draft} />
  </div>
);

export default MobileRegistrationSummary;
