import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Pencil,
  UserRound,
  MapPin,
  PhoneCall,
  HeartPulse,
  Route,
  BedDouble,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import { DataRow } from '@/features/dashboard/components/SummaryCard';
import { RegistrationNumberCard } from '@/features/dashboard/components/RegistrationNumberCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';
import { computeAge } from '@/utils/computeAge';
import { DOCUMENT_TYPE_META } from '@/validators/document.schema';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
};

const capitalize = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

const RowList = ({ children }) => <div className="flex flex-col gap-2 text-sm">{children}</div>;

const MyRegistrationSkeleton = () => (
  <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-14 w-full rounded-2xl" />
    ))}
  </div>
);

export const MyRegistrationPage = () => {
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();
  const { data: documents } = useDocuments();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  if (isPending) {
    return <MyRegistrationSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">{error?.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="size-3.5" /> Try again
        </Button>
      </div>
    );
  }

  const personal = snapshot?.personalInformation?.data ?? {};
  const emergency = snapshot?.emergencyContact?.data ?? {};
  const medical = snapshot?.medicalProfile?.data ?? {};
  const travel = snapshot?.travelInformation?.data ?? {};
  const accommodation = snapshot?.accommodation?.data ?? {};
  const familyMembers = snapshot?.familyMembers ?? [];
  const statusMeta = getRegistrationStatusMeta(snapshot?.registrationStatus);
  const profilePhotoDoc = (documents || []).find((doc) => doc.type === 'profilePhoto');
  const profilePhoto = profilePhotoDoc || (snapshot?.personalInformation?.data?.photoUrl ? { url: snapshot.personalInformation.data.photoUrl } : null);
  const age = computeAge(personal.dob);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground">My Registration</h1>
          <p className="truncate text-xs text-muted-foreground">Everything you submitted during registration.</p>
        </div>
        <Button asChild size="sm" variant="outline" className="h-9 shrink-0 gap-1.5">
          <Link to="/registration/edit">
            <Pencil className="size-3.5" /> Edit
          </Link>
        </Button>
      </div>

      <div className="glass-card flex items-center justify-between gap-2 rounded-2xl border-none p-4">
        <p className="text-sm font-semibold text-foreground">Registration Status</p>
        <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
      </div>

      <RegistrationNumberCard registrationNumber={snapshot?.registrationNumber} />

      <CollapsibleSection title="Personal Information" icon={UserRound} defaultOpen>
        <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
          <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary">
            {profilePhoto ? (
              <img src={profilePhoto.url} alt="Profile" className="size-full object-cover" />
            ) : (
              <UserRound className="size-6" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{personal.fullName || 'Not provided'}</p>
            <p className="text-xs text-muted-foreground">Photo</p>
          </div>
        </div>
        <RowList>
          <DataRow label="Full Name" value={personal.fullName} />
          <DataRow label="Gender" value={capitalize(personal.gender)} />
          <DataRow label="Date of Birth" value={formatDate(personal.dob)} />
          <DataRow label="Age" value={age} />
          <DataRow label="Nationality" value={personal.nationality} />
          <DataRow label="Language" value={personal.language} />
          <DataRow label="Aadhaar Number" value={personal.aadhaarNumber} />
          <DataRow label="Mobile Number" value={personal.mobile} />
          <DataRow label="Alternate Mobile" value={personal.alternateMobile} />
          <DataRow label="Email" value={personal.email} />
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Address" icon={MapPin}>
        <RowList>
          <DataRow label="Address" value={personal.address} />
          <DataRow label="Village / Town" value={personal.village} />
          <DataRow label="Taluka" value={personal.taluka} />
          <DataRow label="District" value={personal.district} />
          <DataRow label="State" value={personal.state} />
          <DataRow label="PIN Code" value={personal.pinCode} />
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Emergency Contact" icon={PhoneCall}>
        <RowList>
          <DataRow label="Contact Name" value={emergency.contactName} />
          <DataRow label="Relationship" value={emergency.relationship} />
          <DataRow label="Mobile Number" value={emergency.phone} />
          <DataRow label="Alternative Phone" value={emergency.alternativePhone} />
          {emergency.contactName2 && (
            <>
              <div className="my-1 border-t border-border/50 pt-2 font-semibold text-primary">Emergency Contact 2</div>
              <DataRow label="Contact Name" value={emergency.contactName2} />
              <DataRow label="Relationship" value={emergency.relationship2} />
              <DataRow label="Mobile Number" value={emergency.phone2} />
              <DataRow label="Alternative Phone" value={emergency.alternativePhone2} />
            </>
          )}
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Medical Information" icon={HeartPulse}>
        <RowList>
          <DataRow label="Blood Group" value={medical.bloodGroup} />
          <DataRow label="Allergies" value={Array.isArray(medical.allergies) ? medical.allergies.join(', ') : medical.allergies} />
          <DataRow label="Medical Conditions" value={Array.isArray(medical.medicalConditions) ? medical.medicalConditions.join(', ') : medical.medicalConditions} />
          <DataRow label="Current Medicines" value={medical.currentMedicines} />
          <DataRow label="Family Doctor Name" value={medical.doctorName} />
          <DataRow label="Emergency Notes" value={medical.emergencyNotes} />
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Travel Information" icon={Route}>
        <RowList>
          <DataRow label="Arrival Date" value={formatDate(travel.arrivalDate)} />
          <DataRow label="Departure Date" value={formatDate(travel.departureDate)} />
          <DataRow label="Mode of Transport" value={travel.mode === 'Other' && travel.travelModeOther ? `Other (${travel.travelModeOther})` : travel.mode} />
          <DataRow label="Vehicle Number" value={travel.vehicleNumber} />
          <DataRow label="Railway Station" value={travel.railwayStation} />
          <DataRow label="Bus Stand" value={travel.busStand} />
          <DataRow label="Expected Holy Bath Date" value={formatDate(travel.holyBathDate)} />
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Accommodation" icon={BedDouble}>
        <RowList>
          <DataRow label="Type" value={accommodation.type} />
          <DataRow label="Address" value={accommodation.address} />
          {accommodation.expectedArrivalDate && (
            <DataRow label="Expected Arrival Date" value={formatDate(accommodation.expectedArrivalDate)} />
          )}
          {accommodation.expectedDepartureDate && (
            <DataRow label="Expected Departure Date" value={formatDate(accommodation.expectedDepartureDate)} />
          )}
        </RowList>
      </CollapsibleSection>

      <CollapsibleSection title="Family Members" icon={Users} badge={familyMembers.length > 0 && (
        <Badge variant="outline">{familyMembers.length}</Badge>
      )}>
        {familyMembers.length === 0 ? (
          <p className="text-xs text-muted-foreground">No family members were added.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {familyMembers.map((member) => {
              const memData = member.data || member;
              return (
                <div key={member._id || memData.fullName} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-primary border border-border">
                    {memData.photoUrl ? (
                      <img src={memData.photoUrl} alt={memData.fullName} className="size-full object-cover" />
                    ) : (
                      <UserRound className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{memData.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {memData.relationship} • {memData.age} yrs ·{' '}
                      <span className="capitalize">{memData.gender}</span>
                    </p>
                    {memData.aadhaarNumber && (
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        Aadhaar: {memData.aadhaarNumber}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Documents" icon={FileText}>
        <div className="flex flex-col gap-2.5">
          {Object.entries(DOCUMENT_TYPE_META).map(([type, meta]) => {
            if (type === 'familyMemberPhoto') {
              const familyPhotos = familyMembers.filter((m) => Boolean((m.data || m).photoUrl));
              const familyDocs = (documents || []).filter((doc) => doc.type === 'familyMemberPhoto');
              const hasPhotos = familyPhotos.length > 0 || familyDocs.length > 0;

              return (
                <div key={type} className="flex flex-col gap-2 rounded-xl bg-muted/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                    <Badge variant={hasPhotos ? 'default' : 'outline'} className="shrink-0">
                      {hasPhotos ? `Uploaded (${familyPhotos.length || familyDocs.length})` : 'Not Uploaded'}
                    </Badge>
                  </div>
                  {!hasPhotos ? (
                    <p className="text-xs text-muted-foreground">No family member photos uploaded.</p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-1">
                      {familyPhotos.map((m) => {
                        const mData = m.data || m;
                        return (
                          <a
                            key={m._id || mData.fullName}
                            href={mData.photoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-lg bg-background p-2.5 hover:bg-accent transition-colors"
                          >
                            <img
                              src={mData.photoUrl}
                              alt={mData.fullName}
                              className="size-10 shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">{mData.fullName}</p>
                              <p className="text-xs text-muted-foreground">{mData.relationship} • Tap to view</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">View</Badge>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const docsOfType = (documents || []).filter((doc) => doc.type === type);
            const firstDoc = docsOfType[0];
            const RowTag = firstDoc ? 'a' : 'div';

            return (
              <RowTag
                key={type}
                {...(firstDoc ? { href: firstDoc.url, target: '_blank', rel: 'noreferrer' } : {})}
                className="flex items-center gap-3 rounded-xl bg-muted p-3"
              >
                {firstDoc?.mimeType?.startsWith('image/') ? (
                  <img src={firstDoc.url} alt={meta.label} className="size-11 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <FileText className="size-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {docsOfType.length
                      ? `${docsOfType.length} file${docsOfType.length > 1 ? 's' : ''} · Tap to view`
                      : 'Not uploaded'}
                  </p>
                </div>
                <Badge variant={docsOfType.length > 0 ? 'default' : 'outline'} className="shrink-0">
                  {docsOfType.length > 0 ? 'Uploaded' : 'Not Uploaded'}
                </Badge>
              </RowTag>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default MyRegistrationPage;
