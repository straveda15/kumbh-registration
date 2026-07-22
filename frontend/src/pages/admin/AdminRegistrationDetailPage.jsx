import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Check,
  X,
  MessageCircleQuestion,
  Ban,
  RotateCcw as RestoreIcon,
  Trash2,
  Printer,
  Download,
  FileText,
  Eye,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RegistrationStatusBadge } from '@/features/admin/components/RegistrationStatusBadge';
import { ReasonDialog } from '@/features/admin/components/ReasonDialog';
import { ConfirmActionDialog } from '@/features/admin/components/ConfirmActionDialog';
import { SummaryCard, DataRow } from '@/features/dashboard/components/SummaryCard';
import { ProfileSummaryCard } from '@/features/dashboard/components/ProfileSummaryCard';
import { EmergencyContactSummaryCard } from '@/features/dashboard/components/EmergencyContactSummaryCard';
import { MedicalSummaryCard } from '@/features/dashboard/components/MedicalSummaryCard';
import { TravelSummaryCard } from '@/features/dashboard/components/TravelSummaryCard';
import { AccommodationSummaryCard } from '@/features/dashboard/components/AccommodationSummaryCard';
import { DigitalPassCard } from '@/features/dashboard/components/DigitalPassCard';
import { FamilyMemberTable } from '@/features/registration-wizard/components/FamilyMemberTable';
import { FamilyMemberCard } from '@/features/registration-wizard/components/FamilyMemberCard';
import { DocumentPreviewDialog } from '@/features/documents/components/DocumentPreviewDialog';
import {
  useRegistrationDetail,
  useRegistrationDocuments,
} from '@/features/admin/hooks/useRegistrationDetail';
import { useApprovalActions } from '@/features/admin/hooks/useApprovalActions';
import { formatDateTime } from '@/utils/formatDate';
import { generatePassPdf } from '@/utils/generatePassPdf';
import { getRegistrationStatusMeta } from '@/utils/registrationStatus';

export const AdminRegistrationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'personal';
  const shouldAutoPrint = searchParams.get('print') === '1';
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data, isPending, isError, error } = useRegistrationDetail(id);
  const { data: documents } = useRegistrationDocuments(id);
  const actions = useApprovalActions(id);

  const [dialog, setDialog] = useState(null); // 'approve' | 'reject' | 'requestInfo' | 'suspend' | 'restore' | 'delete' | null
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    if (shouldAutoPrint && activeTab === 'pass' && data?.digitalPass) {
      window.print();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoPrint, activeTab, data?.digitalPass]);

  if (isPending) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{error?.message}</p>;
  }

  const { registration, event, qr, personal, address, emergencyContact, medicalInformation, travelInformation, accommodation, familyMembers, digitalPass } = data;

  const status = registration.registrationStatus;
  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  const setTab = (tab) => setSearchParams({ tab });

  const runSimpleAction = async (mutation, label) => {
    try {
      await mutation.mutateAsync();
      toast.success(label);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setDialog(null);
    }
  };

  const runReasonAction = async (mutation, reason, label) => {
    try {
      await mutation.mutateAsync(reason);
      toast.success(label);
      setDialog(null);
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    try {
      await actions.remove.mutateAsync();
      toast.success('Registration deleted');
      navigate('/admin/registrations');
    } catch (err) {
      toast.error(err.message || 'Could not delete registration');
      setDialog(null);
    }
  };

  const handleDownload = async () => {
    if (!data?.digitalPass) return;
    setIsGeneratingPdf(true);
    try {
      const isRevoked = data.digitalPass.status === 'revoked';
      const isVerified = Boolean(data.digitalPass.passActivated) && !isRevoked;
      const verificationLabel = isRevoked ? 'Revoked' : isVerified ? 'Verified' : 'Pending On-Site Verification';

      await generatePassPdf(
        {
          pilgrimName: data.personal?.data?.fullName,
          registrationNumber: registration.registrationNumber,
          eventName: data.event?.name,
          statusLabel: getRegistrationStatusMeta(status).label,
          verificationLabel,
          accommodation: data.accommodation?.data?.address || data.accommodation?.data?.type,
          qrImage: data.digitalPass.qrImage,
        },
        `${registration.registrationNumber || 'digital-pass'}.pdf`
      );
    } catch {
      toast.error('Could not generate PDF. Try Print instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5 print:hidden">
        <Link to="/admin/registrations">
          <ArrowLeft className="size-4" /> Back to Registrations
        </Link>
      </Button>

      <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border-none p-5 print:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-xl font-semibold text-foreground">
              {personal?.data?.fullName || 'Registration Detail'}
            </h1>
            <RegistrationStatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {registration.registrationNumber} · {registration.pilgrimId}
            {event?.name ? ` · ${event.name}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status === 'submitted' && (
            <>
              <Button size="sm" className="gap-1.5" onClick={() => setDialog('approve')}>
                <Check className="size-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDialog('reject')}>
                <X className="size-3.5" /> Reject
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDialog('requestInfo')}>
                <MessageCircleQuestion className="size-3.5" /> Request Info
              </Button>
            </>
          )}
          {status === 'approved' && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDialog('suspend')}>
              <Ban className="size-3.5" /> Suspend
            </Button>
          )}
          {status === 'suspended' && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setDialog('restore')}>
              <RestoreIcon className="size-3.5" /> Restore
            </Button>
          )}
          <Button size="sm" variant="ghost" className="gap-1.5 text-destructive" onClick={() => setDialog('delete')}>
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setTab} className="print:hidden">
        <TabsList className="w-full flex-wrap justify-start">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          {documents?.length > 0 && <TabsTrigger value="documents">Documents</TabsTrigger>}
          <TabsTrigger value="qr">QR Info</TabsTrigger>
          <TabsTrigger value="pass">Digital Pass</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <ProfileSummaryCard data={personal?.data} detailed />
        </TabsContent>

        <TabsContent value="address" className="mt-4">
          <SummaryCard title="Address" icon={FileText}>
            <DataRow label="Address" value={address?.data?.address} />
            <DataRow label="State" value={address?.data?.state} />
            <DataRow label="District" value={address?.data?.district} />
            <DataRow label="Taluka" value={address?.data?.taluka} />
            <DataRow label="Village / Town" value={address?.data?.village} />
            <DataRow label="PIN Code" value={address?.data?.pinCode} />
          </SummaryCard>
        </TabsContent>

        <TabsContent value="emergency" className="mt-4">
          <EmergencyContactSummaryCard data={emergencyContact?.data} />
        </TabsContent>

        <TabsContent value="medical" className="mt-4">
          <MedicalSummaryCard data={medicalInformation?.data} detailed />
        </TabsContent>

        <TabsContent value="travel" className="mt-4">
          <TravelSummaryCard data={travelInformation?.data} detailed />
        </TabsContent>

        <TabsContent value="accommodation" className="mt-4">
          <AccommodationSummaryCard data={accommodation?.data} />
        </TabsContent>

        <TabsContent value="family" className="mt-4">
          <SummaryCard title="Family Members" icon={FileText}>
            {familyMembers?.length ? (
              <>
                <FamilyMemberTable members={familyMembers} />
                <FamilyMemberCard members={familyMembers} />
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No family members were added.</p>
            )}
          </SummaryCard>
        </TabsContent>

        {documents?.length > 0 && (
          <TabsContent value="documents" className="mt-4">
            <SummaryCard title="Documents" icon={FileText}>
              <ul className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <li key={doc._id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground capitalize">{doc.type.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="truncate text-muted-foreground">{doc.originalName}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="shrink-0" onClick={() => setPreviewDoc(doc)}>
                      <Eye className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </SummaryCard>
          </TabsContent>
        )}

        <TabsContent value="qr" className="mt-4">
          <SummaryCard title="QR Information" icon={QrCode}>
            <DataRow label="Unique Code" value={qr?.uniqueCode} />
            <DataRow label="URL" value={qr?.url} />
            <DataRow label="Status" value={qr?.status} />
            <DataRow label="Scan Count" value={qr?.scanCount} />
            <DataRow
              label="Last Scanned"
              value={qr?.lastScannedAt ? formatDateTime(qr.lastScannedAt) : null}
            />
            <DataRow
              label="Expires At"
              value={qr?.expiresAt ? formatDateTime(qr.expiresAt) : 'Never'}
            />
          </SummaryCard>
        </TabsContent>

        <TabsContent value="pass" className="mt-4">
          {!digitalPass ? (
            <p className="text-sm text-muted-foreground">
              No digital pass yet — generated automatically once the citizen submits.
            </p>
          ) : (
            <div className="mx-auto flex max-w-sm flex-col gap-4">
              <DigitalPassCard
                digitalPass={digitalPass}
                personal={personal?.data}
                accommodation={accommodation?.data}
                registrationStatus={status}
                registrationNumber={registration.registrationNumber}
                eventName={event?.name}
                profilePhotoUrl={profilePhoto?.url}
              />
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" className="flex-1 gap-1.5" onClick={() => window.print()}>
                  <Printer className="size-4" /> Print
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={handleDownload}
                  disabled={isGeneratingPdf}
                >
                  <Download className="size-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmActionDialog
        open={dialog === 'approve'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Approve this registration?"
        description="The citizen will be notified and their digital pass will show as verified."
        confirmLabel="Approve"
        onConfirm={() => runSimpleAction(actions.approve, 'Registration approved')}
      />
      <ReasonDialog
        open={dialog === 'reject'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Reject this registration?"
        confirmLabel="Reject"
        isSubmitting={actions.reject.isPending}
        onConfirm={(reason) => runReasonAction(actions.reject, reason, 'Registration rejected')}
      />
      <ReasonDialog
        open={dialog === 'requestInfo'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Request more information"
        confirmLabel="Send Request"
        isSubmitting={actions.requestInfo.isPending}
        onConfirm={(reason) => runReasonAction(actions.requestInfo, reason, 'Information requested')}
      />
      <ReasonDialog
        open={dialog === 'suspend'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Suspend this registration?"
        confirmLabel="Suspend"
        isSubmitting={actions.suspend.isPending}
        onConfirm={(reason) => runReasonAction(actions.suspend, reason, 'Registration suspended')}
      />
      <ConfirmActionDialog
        open={dialog === 'restore'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Restore this registration?"
        description="This returns it to its status before it was suspended."
        confirmLabel="Restore"
        onConfirm={() => runSimpleAction(actions.restore, 'Registration restored')}
      />
      <ConfirmActionDialog
        open={dialog === 'delete'}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Delete this registration?"
        description="This permanently removes the registration and all related records. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />

      <DocumentPreviewDialog
        open={Boolean(previewDoc)}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
};

export default AdminRegistrationDetailPage;
