import * as notificationService from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listNotifications(req.draft.userId);
  return new ApiResponse(200, { notifications }, 'Notifications fetched successfully').send(res);
});

export const updateMyNotificationStatus = asyncHandler(async (req, res) => {
  const notification = await notificationService.updateNotificationStatus(
    req.draft.userId,
    req.params.id,
    req.body.status
  );
  return new ApiResponse(200, { notification }, 'Notification updated successfully').send(res);
});

export default { listMyNotifications, updateMyNotificationStatus };
