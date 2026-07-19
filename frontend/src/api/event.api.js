import { adminApiClient } from './adminApiClient';

export const listEvents = (params) => adminApiClient.get('/events', { params });
export const getEvent = (id) => adminApiClient.get(`/events/${id}`);
export const createEvent = (payload) => adminApiClient.post('/events', payload);
export const updateEvent = (id, payload) => adminApiClient.put(`/events/${id}`, payload);
export const deleteEvent = (id) => adminApiClient.delete(`/events/${id}`);

export default { listEvents, getEvent, createEvent, updateEvent, deleteEvent };
