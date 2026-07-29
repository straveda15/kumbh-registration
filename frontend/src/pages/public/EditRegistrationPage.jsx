import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  RotateCcw,
  Loader2,
  ShieldAlert,
  UserRound,
  MapPin,
  PhoneCall,
  HeartPulse,
  Route,
  BedDouble,
  Users,
  FileText,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import { WizardField } from '@/features/registration-wizard/components/WizardField';
import { FamilyMemberFormDialog } from '@/features/registration-wizard/components/FamilyMemberFormDialog';
import { FamilyMemberTable } from '@/features/registration-wizard/components/FamilyMemberTable';
import { FamilyMemberCard } from '@/features/registration-wizard/components/FamilyMemberCard';
import { DocumentUploadCard } from '@/features/documents/components/DocumentUploadCard';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useSavePersonalInformation } from '@/features/registration-wizard/hooks/useSavePersonalInformation';
import { useSaveWizardStep } from '@/features/registration-wizard/hooks/useSaveWizardStep';
import { useFamilyMembers } from '@/features/registration-wizard/hooks/useFamilyMembers';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import {
  saveEmergencyContact,
  saveMedicalInformation,
  saveTravelInformation,
  saveAccommodation,
} from '@/api/registration.api';
import { personalInformationSchema, personalInformationDefaults, LANGUAGE_OPTIONS } from '@/validators/personalInformation.schema';
import { emergencyContactSchema, emergencyContactDefaults } from '@/validators/emergencyContact.schema';
import { medicalInformationSchema, medicalInformationDefaults, BLOOD_GROUPS } from '@/validators/medicalInformation.schema';
import {
  travelInformationSchema,
  travelInformationDefaults,
  TRAVEL_MODES,
  getMinArrivalDate,
} from '@/validators/travelInformation.schema';
import { accommodationSchema, accommodationDefaults, ACCOMMODATION_TYPES } from '@/validators/accommodation.schema';
import { RELATIONSHIP_OPTIONS } from '@/utils/relationshipOptions';
import { INDIAN_STATES_AND_UTS } from '@/utils/indianStates';
import { CITIES_BY_STATE } from '@/utils/indianCitiesByState';
import { DOCUMENT_TYPE_META } from '@/validators/document.schema';

// Mirrors the backend's EDITABLE_STATUSES (registration.service.js's
// assertDraftEditable) — a registration stays editable while still a draft,
// or after an admin has explicitly asked for more information.
const EDITABLE_STATUSES = ['draft', 'info_requested'];

const STATE_OPTIONS = INDIAN_STATES_AND_UTS.map((state) => ({ value: state, label: state }));
const EMPTY_CITY_OPTIONS = [];
const CITY_OPTIONS_BY_STATE = Object.fromEntries(
  Object.entries(CITIES_BY_STATE).map(([state, cities]) => [state, cities.map((city) => ({ value: city, label: city }))])
);

const toDateInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const MIN_ARRIVAL_DATE = toDateInputValue(getMinArrivalDate());

const FieldsGrid = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
);

const EditRegistrationSkeleton = () => (
  <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="h-14 w-full rounded-2xl" />
    ))}
  </div>
);

export const EditRegistrationPage = () => {
  const navigate = useNavigate();
  const code = useDraftSessionStore((state) => state.code);
  const { data: snapshot, isPending, isError, error, refetch, hasSession } = useRegistrationSnapshot();

  const savePersonalMutation = useSavePersonalInformation(code);
  const saveEmergencyMutation = useSaveWizardStep(code, saveEmergencyContact);
  const saveMedicalMutation = useSaveWizardStep(code, saveMedicalInformation);
  const saveTravelMutation = useSaveWizardStep(code, saveTravelInformation);
  const saveAccommodationMutation = useSaveWizardStep(code, saveAccommodation);
  const { add: addMember, update: updateMember, remove: removeMember } = useFamilyMembers(code);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState(null);

  const personalForm = useForm({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: { ...personalInformationDefaults, ...snapshot?.personalInformation?.data },
  });
  const emergencyForm = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { ...emergencyContactDefaults, ...snapshot?.emergencyContact?.data },
  });
  const medicalForm = useForm({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: { ...medicalInformationDefaults, ...snapshot?.medicalProfile?.data },
  });
  const travelForm = useForm({
    resolver: zodResolver(travelInformationSchema),
    defaultValues: { ...travelInformationDefaults, ...snapshot?.travelInformation?.data },
  });
  const accommodationForm = useForm({
    resolver: zodResolver(accommodationSchema),
    defaultValues: { ...accommodationDefaults, ...snapshot?.accommodation?.data },
  });

  // useForm's defaultValues are only captured on the very first render —
  // which happens while `snapshot` is still loading (isPending), so it's
  // always empty at that point. Once the real data arrives, each form must
  // be explicitly reset to it (same pattern ProfilePage's editProfileForm
  // uses) or every field would stay blank forever despite data existing.
  useEffect(() => {
    if (!snapshot) return;
    personalForm.reset({ ...personalInformationDefaults, ...snapshot.personalInformation?.data });
    emergencyForm.reset({ ...emergencyContactDefaults, ...snapshot.emergencyContact?.data });
    medicalForm.reset({ ...medicalInformationDefaults, ...snapshot.medicalProfile?.data });
    travelForm.reset({ ...travelInformationDefaults, ...snapshot.travelInformation?.data });
    accommodationForm.reset({ ...accommodationDefaults, ...snapshot.accommodation?.data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot?.registrationId]);

  // Hooks above must run unconditionally on every render, so the
  // early-return guards for session/loading/error state come after them.
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
    return <EditRegistrationSkeleton />;
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

  const canEdit = EDITABLE_STATUSES.includes(snapshot?.registrationStatus);

  if (!canEdit) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <ShieldAlert className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Editing Disabled</p>
        <p className="text-sm text-muted-foreground">
          Your registration has been submitted. Editing has been disabled. Please contact the administrator if
          changes are required.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/registration">Back to My Registration</Link>
        </Button>
      </div>
    );
  }

  const familyMembers = snapshot?.familyMembers ?? [];
  const selectedState = personalForm.watch('state');
  const cityOptions = selectedState ? CITY_OPTIONS_BY_STATE[selectedState] || EMPTY_CITY_OPTIONS : EMPTY_CITY_OPTIONS;
  const arrivalValue = travelForm.watch('arrivalDate');
  const minDepartureDate = arrivalValue || MIN_ARRIVAL_DATE;

  const sectionMutations = [
    savePersonalMutation,
    saveEmergencyMutation,
    saveMedicalMutation,
    saveTravelMutation,
    saveAccommodationMutation,
  ];
  const isSaving = sectionMutations.some((mutation) => mutation.isPending);

  const handleCancel = () => navigate('/registration');

  const handleSaveAll = async () => {
    const results = await Promise.all([
      personalForm.trigger(),
      emergencyForm.trigger(),
      medicalForm.trigger(),
      travelForm.trigger(),
      accommodationForm.trigger(),
    ]);
    if (results.some((ok) => !ok)) {
      toast.error('Please fix the highlighted errors before saving.');
      return;
    }

    try {
      // password/confirmPassword ride along in personalInformationSchema
      // only because Step 1 of the wizard reuses it to also set the account
      // password — this page has no password fields at all (that's the
      // Profile page's dedicated Change Password feature), so they're
      // always blank here and must never be sent through the generic
      // personal-info save.
      const personalFields = personalForm.getValues();
      delete personalFields.password;
      delete personalFields.confirmPassword;
      await Promise.all([
        savePersonalMutation.mutateAsync(personalFields),
        saveEmergencyMutation.mutateAsync(emergencyForm.getValues()),
        saveMedicalMutation.mutateAsync(medicalForm.getValues()),
        saveTravelMutation.mutateAsync(travelForm.getValues()),
        saveAccommodationMutation.mutateAsync(accommodationForm.getValues()),
      ]);
      toast.success('Registration updated successfully');
      navigate('/registration');
    } catch (err) {
      toast.error(err.message || 'Could not save changes. Please try again.');
    }
  };

  const openAddDialog = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };
  const openEditDialog = (member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };
  const handleMemberSubmit = async (values) => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember._id, payload: values });
        toast.success('Family member updated');
      } else {
        await addMember.mutateAsync(values);
        toast.success('Family member added');
      }
      return true;
    } catch (err) {
      toast.error(err.message || 'Could not save family member');
      return false;
    }
  };
  const confirmDeleteMember = async () => {
    if (!memberPendingDelete) return;
    try {
      await removeMember.mutateAsync(memberPendingDelete._id);
      toast.success('Family member removed');
    } catch (err) {
      toast.error(err.message || 'Could not remove family member');
    } finally {
      setMemberPendingDelete(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6 pb-24">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Edit Registration</h1>
        <p className="text-xs text-muted-foreground">Update your details below, then save your changes.</p>
      </div>

      <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-3">
        <CollapsibleSection title="Personal Information" icon={UserRound} defaultOpen>
          <FieldsGrid>
            <WizardField label="Full Name" error={personalForm.formState.errors.fullName?.message}>
              <Input className="h-12 px-4" {...personalForm.register('fullName')} />
            </WizardField>
            <WizardField label="Gender" error={personalForm.formState.errors.gender?.message}>
              <Select
                value={personalForm.watch('gender')}
                onValueChange={(value) => personalForm.setValue('gender', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField label="Date of Birth" error={personalForm.formState.errors.dob?.message}>
              <Input className="h-12 px-4" type="date" {...personalForm.register('dob')} />
            </WizardField>
            <WizardField label="Nationality" error={personalForm.formState.errors.nationality?.message}>
              <Input className="h-12 px-4" {...personalForm.register('nationality')} />
            </WizardField>
            <WizardField label="Aadhaar Number" error={personalForm.formState.errors.aadhaarNumber?.message}>
              <Input className="h-12 px-4" {...personalForm.register('aadhaarNumber')} inputMode="numeric" maxLength={12} />
            </WizardField>
            <WizardField label="Mobile Number" error={personalForm.formState.errors.mobile?.message}>
              <Input
                className="h-12 px-4"
                {...personalForm.register('mobile')}
                inputMode="numeric"
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
              />
            </WizardField>
            <WizardField label="Alternate Mobile" error={personalForm.formState.errors.alternateMobile?.message}>
              <Input
                className="h-12 px-4"
                {...personalForm.register('alternateMobile')}
                inputMode="numeric"
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
                placeholder="Optional"
              />
            </WizardField>
            <WizardField label="Email" error={personalForm.formState.errors.email?.message}>
              <Input className="h-12 px-4" type="email" {...personalForm.register('email')} />
            </WizardField>
            <WizardField label="Preferred Language" className="sm:col-span-2" error={personalForm.formState.errors.language?.message}>
              <Select
                value={personalForm.watch('language')}
                onValueChange={(value) => personalForm.setValue('language', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select preferred language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>

        <CollapsibleSection title="Address" icon={MapPin}>
          <FieldsGrid>
            <WizardField label="State" error={personalForm.formState.errors.state?.message}>
              <Combobox
                className="h-12 px-4"
                options={STATE_OPTIONS}
                value={selectedState}
                onValueChange={(value) => {
                  personalForm.setValue('state', value, { shouldValidate: true, shouldDirty: true });
                  personalForm.setValue('district', '', { shouldValidate: false, shouldDirty: true });
                  personalForm.setValue('taluka', '', { shouldValidate: false, shouldDirty: true });
                  personalForm.setValue('village', '', { shouldValidate: false, shouldDirty: true });
                }}
                placeholder="Select State"
                searchPlaceholder="Search states…"
                emptyText="No matching state or UT."
              />
            </WizardField>
            <WizardField label="District" error={personalForm.formState.errors.district?.message}>
              <Combobox
                className="h-12 px-4"
                options={districtOptions}
                value={selectedDistrict}
                onValueChange={(value) => {
                  personalForm.setValue('district', value, { shouldValidate: false, shouldDirty: true });
                }}
                placeholder={selectedState ? 'Select District (Optional)' : 'Select State first'}
                searchPlaceholder="Search districts…"
                emptyText="No matching district."
                allowCustomValue
                disabled={!selectedState}
              />
            </WizardField>
            <WizardField label="Taluka" error={personalForm.formState.errors.taluka?.message}>
              <Combobox
                className="h-12 px-4"
                options={talukaOptions}
                value={selectedTaluka}
                onValueChange={(value) => {
                  personalForm.setValue('taluka', value, { shouldValidate: false, shouldDirty: true });
                }}
                placeholder={selectedState ? 'Select Taluka (Optional)' : 'Select State first'}
                searchPlaceholder="Search talukas…"
                emptyText="No matching taluka."
                allowCustomValue
                disabled={!selectedState}
              />
            </WizardField>
            <WizardField label="Village / Town" error={personalForm.formState.errors.village?.message}>
              <Combobox
                className="h-12 px-4"
                options={cityOptions}
                value={personalForm.watch('village')}
                onValueChange={(value) => personalForm.setValue('village', value, { shouldValidate: true, shouldDirty: true })}
                placeholder={selectedState ? 'Select City / Town' : 'Select State First'}
                searchPlaceholder="Search city or town…"
                emptyText="No matching city — pick “Use” below to enter it as typed."
                allowCustomValue
                disabled={!selectedState}
              />
            </WizardField>
            <WizardField label="Address" className="sm:col-span-2" error={personalForm.formState.errors.address?.message}>
              <Input className="h-12 px-4" {...personalForm.register('address')} placeholder="House / street" />
            </WizardField>
            <WizardField label="PIN Code" error={personalForm.formState.errors.pinCode?.message}>
              <Input className="h-12 px-4" {...personalForm.register('pinCode')} inputMode="numeric" />
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>

        <CollapsibleSection title="Emergency Contact" icon={PhoneCall}>
          <FieldsGrid>
            <WizardField label="Contact Name" error={emergencyForm.formState.errors.contactName?.message}>
              <Input className="h-12 px-4" {...emergencyForm.register('contactName')} />
            </WizardField>
            <WizardField label="Relationship" error={emergencyForm.formState.errors.relationship?.message}>
              <Select
                value={emergencyForm.watch('relationship')}
                onValueChange={(value) => emergencyForm.setValue('relationship', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField label="Mobile Number" error={emergencyForm.formState.errors.phone?.message}>
              <Input
                className="h-12 px-4"
                {...emergencyForm.register('phone')}
                inputMode="numeric"
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
              />
            </WizardField>
            <WizardField label="Alternative Phone" error={emergencyForm.formState.errors.alternativePhone?.message}>
              <Input
                className="h-12 px-4"
                {...emergencyForm.register('alternativePhone')}
                inputMode="numeric"
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                }}
                placeholder="Optional"
              />
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>

        <CollapsibleSection title="Medical Information" icon={HeartPulse}>
          <FieldsGrid>
            <WizardField label="Blood Group" error={medicalForm.formState.errors.bloodGroup?.message}>
              <Select
                value={medicalForm.watch('bloodGroup')}
                onValueChange={(value) => medicalForm.setValue('bloodGroup', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField label="Doctor Name" error={medicalForm.formState.errors.doctorName?.message}>
              <Input className="h-12 px-4" {...medicalForm.register('doctorName')} placeholder="Optional" />
            </WizardField>
            <WizardField label="Medical Conditions" className="sm:col-span-2" error={medicalForm.formState.errors.medicalConditions?.message}>
              <Textarea className="px-4 py-3" {...medicalForm.register('medicalConditions')} placeholder="Optional" rows={2} />
            </WizardField>
            <WizardField label="Current Medicines" className="sm:col-span-2" error={medicalForm.formState.errors.currentMedicines?.message}>
              <Textarea className="px-4 py-3" {...medicalForm.register('currentMedicines')} placeholder="Optional" rows={2} />
            </WizardField>
            <WizardField label="Allergies" className="sm:col-span-2" error={medicalForm.formState.errors.allergies?.message}>
              <Textarea className="px-4 py-3" {...medicalForm.register('allergies')} placeholder="Optional" rows={2} />
            </WizardField>
            <WizardField label="Emergency Notes" className="sm:col-span-2" error={medicalForm.formState.errors.emergencyNotes?.message}>
              <Textarea className="px-4 py-3" {...medicalForm.register('emergencyNotes')} placeholder="Optional" rows={2} />
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>

        <CollapsibleSection title="Travel Information" icon={Route}>
          <FieldsGrid>
            <WizardField label="Arrival Date" error={travelForm.formState.errors.arrivalDate?.message}>
              <Input className="h-12 px-4" type="date" min={MIN_ARRIVAL_DATE} {...travelForm.register('arrivalDate')} />
            </WizardField>
            <WizardField label="Departure Date" error={travelForm.formState.errors.departureDate?.message}>
              <Input className="h-12 px-4" type="date" min={minDepartureDate} {...travelForm.register('departureDate')} />
            </WizardField>
            <WizardField label="Mode of Transport" error={travelForm.formState.errors.mode?.message}>
              <Select
                value={travelForm.watch('mode')}
                onValueChange={(value) => travelForm.setValue('mode', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select mode of travel" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVEL_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField label="Expected Holy Bath Date" error={travelForm.formState.errors.holyBathDate?.message}>
              <Input className="h-12 px-4" type="date" {...travelForm.register('holyBathDate')} />
            </WizardField>
            {travelForm.watch('mode') === 'Private Vehicle' && (
              <WizardField label="Vehicle Number" error={travelForm.formState.errors.vehicleNumber?.message}>
                <Input className="h-12 px-4" {...travelForm.register('vehicleNumber')} placeholder="Optional" />
              </WizardField>
            )}
            <WizardField label="Railway Station" error={travelForm.formState.errors.railwayStation?.message}>
              <Input className="h-12 px-4" {...travelForm.register('railwayStation')} placeholder="Optional" />
            </WizardField>
            <WizardField label="Bus Stand" error={travelForm.formState.errors.busStand?.message}>
              <Input className="h-12 px-4" {...travelForm.register('busStand')} placeholder="Optional" />
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>

        <CollapsibleSection title="Accommodation" icon={BedDouble}>
          <FieldsGrid>
            <WizardField label="Accommodation Type" error={accommodationForm.formState.errors.type?.message}>
              <Select
                value={accommodationForm.watch('type')}
                onValueChange={(value) => accommodationForm.setValue('type', value, { shouldValidate: true, shouldDirty: true })}
              >
                <SelectTrigger className="h-12 w-full px-4">
                  <SelectValue placeholder="Select accommodation type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WizardField>
            <WizardField label="Accommodation Address *" error={accommodationForm.formState.errors.address?.message}>
              <Input className="h-12 px-4" {...accommodationForm.register('address')} />
            </WizardField>
            <WizardField label="Expected Arrival Date" error={accommodationForm.formState.errors.expectedArrivalDate?.message}>
              <Input
                className="h-12 px-4"
                type="date"
                {...accommodationForm.register('expectedArrivalDate')}
              />
            </WizardField>
            <WizardField label="Expected Departure Date" error={accommodationForm.formState.errors.expectedDepartureDate?.message}>
              <Input
                className="h-12 px-4"
                type="date"
                min={accommodationForm.watch('expectedArrivalDate') || undefined}
                {...accommodationForm.register('expectedDepartureDate')}
              />
            </WizardField>
          </FieldsGrid>
        </CollapsibleSection>
      </form>

      <CollapsibleSection title="Family Members" icon={Users}>
        <div className="mb-3 flex justify-end">
          <Button size="sm" onClick={openAddDialog} className="h-9 gap-1.5">
            <Plus className="size-3.5" /> Add Member
          </Button>
        </div>
        {familyMembers.length === 0 ? (
          <p className="py-2 text-center text-xs text-muted-foreground">No family members added yet.</p>
        ) : (
          <>
            <FamilyMemberTable members={familyMembers} onEdit={openEditDialog} onDelete={setMemberPendingDelete} />
            <FamilyMemberCard members={familyMembers} onEdit={openEditDialog} onDelete={setMemberPendingDelete} />
          </>
        )}
        <p className="mt-3 text-center text-xs text-muted-foreground">Family member changes save immediately.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Uploaded Documents" icon={FileText}>
        <div className="flex flex-col gap-4">
          {Object.keys(DOCUMENT_TYPE_META).map((type) => (
            <DocumentUploadCard key={type} type={type} />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">Document uploads save immediately.</p>
      </CollapsibleSection>

      <FamilyMemberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingMember?.data}
        onSubmit={handleMemberSubmit}
        isSaving={addMember.isPending || updateMember.isPending}
      />

      <AlertDialog open={Boolean(memberPendingDelete)} onOpenChange={(open) => !open && setMemberPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove family member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberPendingDelete?.data?.fullName || 'this family member'} from your registration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMember}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="sticky bottom-0 z-10 -mx-4 mt-2 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Button type="button" variant="outline" className="h-11 flex-1" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="button" className="h-11 flex-1 gap-1.5" onClick={handleSaveAll} disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" />} Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditRegistrationPage;
