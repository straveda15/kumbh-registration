// Uploads directly to Cloudinary using the backend-issued signed params —
// the file's bytes never touch our server. A plain XMLHttpRequest is used
// deliberately (not axios/fetch) because it's the only way to get real
// upload-progress events for the progress indicator.
export const uploadToCloudinary = ({ file, signatureData, onProgress }) => {
  const { signature, timestamp, apiKey, cloudName, folder, publicId } = signatureData;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('public_id', publicId);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed. Please try again.'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed. Please check your connection.'));

    xhr.send(formData);
  });
};

export default uploadToCloudinary;
