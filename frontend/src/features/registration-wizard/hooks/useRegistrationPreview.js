import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { useWizardLiveDraftStore } from '@/store/useWizardLiveDraftStore';
import { computeAge } from '@/utils/computeAge';

// Shared by the desktop LivePreviewPanel and the mobile collapsible
// Registration Summary card — both need the exact same "live draft
// overlaid on last-saved draft" merge so neither view can drift out of
// sync with the other as a pilgrim fills the form.
export const useRegistrationPreview = (draft) => {
  const livePersonal = useWizardLiveDraftStore((state) => state.personalInformation);
  const liveMedical = useWizardLiveDraftStore((state) => state.medicalProfile);
  const liveTravel = useWizardLiveDraftStore((state) => state.travelInformation);
  const { data: documents } = useDocuments();

  const personal = livePersonal ?? draft?.personalInformation?.data;
  const medical = liveMedical ?? draft?.medicalProfile?.data;
  const travel = liveTravel ?? draft?.travelInformation?.data;
  const accommodation = draft?.accommodation?.data;
  const familyCount = draft?.familyMembers?.length ?? 0;

  const profilePhoto = (documents || []).find((doc) => doc.type === 'profilePhoto');

  const age = computeAge(personal?.dob);
  const subtitleParts = [
    personal?.gender && personal.gender.charAt(0).toUpperCase() + personal.gender.slice(1),
    age && `${age} yrs`,
    personal?.language,
  ].filter(Boolean);

  return { personal, medical, travel, accommodation, familyCount, profilePhoto, age, subtitleParts };
};

export default useRegistrationPreview;
