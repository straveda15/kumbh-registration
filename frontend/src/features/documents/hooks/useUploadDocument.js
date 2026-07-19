import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUploadSignature, createDocument } from '@/api/document.api';
import { uploadToCloudinary } from '@/api/cloudinaryUpload';
import { DOCUMENTS_QUERY_KEY } from './useDocuments';

// Orchestrates the 3-step signed-upload flow: get a signature from our API
// -> upload the file straight to Cloudinary (with progress) -> register the
// resulting URL with our API. This is the frontend's equivalent of the
// backend's document.service.js, kept out of api/ (which stays pure HTTP).
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, type, onProgress }) => {
      const signatureData = await getUploadSignature(type);
      const cloudinaryResult = await uploadToCloudinary({ file, signatureData, onProgress });

      return createDocument({
        type,
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });
};

export default useUploadDocument;
