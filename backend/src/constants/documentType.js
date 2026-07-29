export const DOCUMENT_TYPE = Object.freeze({
  PROFILE_PHOTO: 'profilePhoto',
  FAMILY_MEMBER_PHOTO: 'familyMemberPhoto',
  GOVERNMENT_ID: 'governmentId',
  MEDICAL_REPORT: 'medicalReport',
  OTHER: 'other',
});

export const DOCUMENT_TYPE_VALUES = Object.values(DOCUMENT_TYPE);

// These two are 1-per-registration — uploading a new one replaces the old.
export const SINGLE_INSTANCE_DOCUMENT_TYPES = [
  DOCUMENT_TYPE.PROFILE_PHOTO,
  DOCUMENT_TYPE.GOVERNMENT_ID,
];

export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const MAX_DOCUMENT_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export default DOCUMENT_TYPE;
