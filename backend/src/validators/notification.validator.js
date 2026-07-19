import { z } from 'zod';
import { NOTIFICATION_STATUSES } from '../models/notification.model.js';
import { objectIdSchema } from './common.validator.js';

export const updateNotificationStatusSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    status: z.enum(NOTIFICATION_STATUSES),
  }),
};

export default { updateNotificationStatusSchema };
