import { RegistrationPreviewFields } from './RegistrationPreviewFields';

// Desktop-only sidebar (hidden below `lg`, see WizardLayout) — reads
// whatever the wizard has already fetched into `draft`, overlaid with
// whatever the live-draft store has mirrored from the active step's form
// on every keystroke, via useRegistrationPreview (see
// RegistrationPreviewFields), so the preview updates immediately while
// typing, not just after a field blurs and autosaves.
export const LivePreviewPanel = ({ draft }) => (
  <aside className="lg:sticky lg:top-8 lg:h-fit">
    <div className="rounded-[24px] border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,.04),0_8px_20px_rgba(37,99,235,.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,.25)]">
      <p className="mb-4 text-xs font-semibold tracking-wider text-[var(--w-muted)] uppercase">Preview</p>
      <RegistrationPreviewFields draft={draft} />
    </div>
  </aside>
);

export default LivePreviewPanel;
