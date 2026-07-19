import { adminApiClient } from './adminApiClient';

export const listQR = (params) => adminApiClient.get('/qr', { params });
export const regenerateQR = (eventId) => adminApiClient.post(`/qr/regenerate/${eventId}`);
export const updateQR = (id, payload) => adminApiClient.put(`/qr/${id}`, payload);

export default { listQR, regenerateQR, updateQR };
