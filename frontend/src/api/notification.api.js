import { axiosClient } from './axiosClient';

// Backend wraps these in a named key inside the standard {success, message,
// data} envelope (`{ notifications }` / `{ notification }`, see
// backend/src/controllers/notification.controller.js). axiosClient's
// interceptor only unwraps the outer envelope, so unwrap the named key here
// too — every caller then gets the bare Notification[] / Notification,
// never `{ notifications: [...] }`.
export const listNotifications = () => axiosClient.get('/notifications').then((res) => res.notifications);

export const updateNotificationStatus = (id, status) =>
  axiosClient.patch(`/notifications/${id}`, { status }).then((res) => res.notification);

export default { listNotifications, updateNotificationStatus };
