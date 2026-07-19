import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createNotification = async ({
  userId,
  registrationId = null,
  type,
  title,
  message,
  channel = 'in_app',
}) => {
  await Notification.create({ userId, registrationId, type, title, message, channel });
};

export const listNotifications = async (userId) =>
  Notification.find({ userId }).sort({ createdAt: -1 });

export const updateNotificationStatus = async (userId, notificationId, status) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { status, ...(status === 'read' ? { readAt: new Date() } : {}) } },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  return notification;
};

export default { createNotification, listNotifications, updateNotificationStatus };
