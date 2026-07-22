import { UserRound } from 'lucide-react';
import { useRegistrationPreview } from '../hooks/useRegistrationPreview';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
};

// Nothing entered yet for this field — omit the row entirely rather than
// rendering a bare "—"/"N/A" placeholder, so the preview only ever shows
// real, already-entered information.
const PreviewRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2.5 text-sm last:border-b-0">
      <dt className="text-[var(--w-muted)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  );
};

// Avatar header + field rows shared by the desktop LivePreviewPanel aside
// and the mobile collapsible Profile Preview card — same content, different
// chrome around it.
export const RegistrationPreviewFields = ({ draft }) => {
  const { personal, medical, travel, accommodation, familyCount, profilePhoto, subtitleParts } =
    useRegistrationPreview(draft);

  return (
    <>
      <div className="mb-1 flex items-center gap-3 border-b border-border pb-4">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary">
          {profilePhoto ? (
            <img src={profilePhoto.url} alt="Uploaded Passport Photograph" className="size-full object-cover" />
          ) : (
            <UserRound className="size-6" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">{personal?.fullName || 'Your Name'}</p>
          <p className="truncate text-xs text-[var(--w-muted)]">
            {subtitleParts.length ? subtitleParts.join(' • ') : 'Details will appear as you fill the form'}
          </p>
        </div>
      </div>

      <dl className="flex flex-col">
        <PreviewRow label="Mobile" value={personal?.mobile} />
        <PreviewRow label="District" value={personal?.district} />
        <PreviewRow label="Blood Group" value={medical?.bloodGroup} />
        <PreviewRow label="Arrival" value={formatDate(travel?.arrivalDate)} />
        <PreviewRow label="Accommodation" value={accommodation?.type} />
        <PreviewRow
          label="Family Members"
          value={familyCount ? `${familyCount} Member${familyCount === 1 ? '' : 's'}` : null}
        />
      </dl>
    </>
  );
};

export default RegistrationPreviewFields;
