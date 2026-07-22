import { create } from 'zustand';

// Ephemeral, per-keystroke mirror of whatever the active step's form
// currently holds — not persisted, not sent anywhere. Step forms push their
// live `watch()` values in here (see PersonalInformationStep/
// MedicalInformationStep/TravelInformationStep's live-preview effect);
// LivePreviewPanel reads it so the preview updates as the pilgrim types,
// instead of only after a field blurs and autosaves.
export const useWizardLiveDraftStore = create((set) => ({
  personalInformation: null,
  medicalProfile: null,
  travelInformation: null,

  setLiveSection: (section, data) => set({ [section]: data }),
}));

export default useWizardLiveDraftStore;
