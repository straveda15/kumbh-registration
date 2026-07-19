import { ActivityLog } from '../models/activityLog.model.js';

export const logActivity = async ({
  actorType,
  actorId = null,
  userId = null,
  registrationId = null,
  action,
  metadata = {},
  ipAddress = null,
  userAgent = null,
}) => {
  await ActivityLog.create({
    actorType,
    actorId,
    userId,
    registrationId,
    action,
    metadata,
    ipAddress,
    userAgent,
  });
};

export default { logActivity };
