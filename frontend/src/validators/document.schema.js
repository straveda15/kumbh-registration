// Mirrors backend/src/constants/documentType.js's ACCEPTED_MIME_TYPES /
// MAX_DOCUMENT_SIZE_BYTES — checked client-side first so a bad file never
// even reaches the signature request.
export const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const MAX_DOCUMENT_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export const validateDocumentFile = (file) => {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return 'Only PDF, JPG, JPEG, or PNG files are accepted.';
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return 'File must be smaller than 8MB.';
  }
  return null;
};

export const DOCUMENT_TYPE_META = {
  profilePhoto: { label: 'Profile Photo', multiple: false, accept: 'image/jpeg,image/png,image/jpg' },
  governmentId: { label: 'Government ID', multiple: false, accept: 'image/jpeg,image/png,image/jpg,application/pdf' },
  medicalReport: { label: 'Medical Reports', multiple: true, accept: 'image/jpeg,image/png,image/jpg,application/pdf' },
  other: { label: 'Other Documents', multiple: true, accept: 'image/jpeg,image/png,image/jpg,application/pdf' },
};

export default { validateDocumentFile, DOCUMENT_TYPE_META };
