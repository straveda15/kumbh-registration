import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { verifyDraftAccess } from '../middlewares/draftAuth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateNotificationStatusSchema } from '../validators/notification.validator.js';

const router = Router();

// Citizen-facing: reuses the same registration session token as the
// wizard/dashboard (see draftAuth.middleware.js — no longer draft-only).
router.get('/', verifyDraftAccess, notificationController.listMyNotifications);
router.patch(
  '/:id',
  verifyDraftAccess,
  validate(updateNotificationStatusSchema),
  notificationController.updateMyNotificationStatus
);

export default router;
