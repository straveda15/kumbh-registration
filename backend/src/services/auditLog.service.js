import { AuditLog } from '../models/auditLog.model.js';

export const logAudit = async ({
  entityType,
  entityId,
  action,
  performedBy = null,
  beforeState = null,
  afterState = null,
  reason = null,
}) => {
  await AuditLog.create({
    entityType,
    entityId,
    action,
    performedBy,
    beforeState,
    afterState,
    reason,
  });
};

export const listAuditLogs = async (entityType, entityId) =>
  AuditLog.find({ entityType, entityId })
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });

export default { logAudit, listAuditLogs };
