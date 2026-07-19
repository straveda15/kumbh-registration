import { Event } from '../models/event.model.js';
import { QRCode } from '../models/qrcode.model.js';
import { Registration } from '../models/registration.model.js';
import { PersonalInformation } from '../models/personalInformation.model.js';
import { ActivityLog } from '../models/activityLog.model.js';
import { QR_STATUS } from '../constants/qrStatus.js';
import { REGISTRATION_STATUS } from '../constants/registrationStatus.js';

export const getAnalyticsOverview = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalEvents, activeQRCodes, scanAggregate, statusCounts, todayRegistrations, totalRegistrations] =
    await Promise.all([
      Event.countDocuments(),
      QRCode.countDocuments({ status: QR_STATUS.ACTIVE }),
      QRCode.aggregate([{ $group: { _id: null, totalScans: { $sum: '$scanCount' } } }]),
      Registration.aggregate([{ $group: { _id: '$registrationStatus', count: { $sum: 1 } } }]),
      Registration.countDocuments({ createdAt: { $gte: startOfToday } }),
      Registration.countDocuments(),
    ]);

  const countsByStatus = Object.fromEntries(statusCounts.map((entry) => [entry._id, entry.count]));

  return {
    totalEvents,
    activeQRCodes,
    totalQRScans: scanAggregate[0]?.totalScans || 0,
    totalRegistrations,
    todayRegistrations,
    approved: countsByStatus[REGISTRATION_STATUS.APPROVED] || 0,
    pending: countsByStatus[REGISTRATION_STATUS.SUBMITTED] || 0,
    rejected: countsByStatus[REGISTRATION_STATUS.REJECTED] || 0,
    drafts: countsByStatus[REGISTRATION_STATUS.DRAFT] || 0,
    infoRequested: countsByStatus[REGISTRATION_STATUS.INFO_REQUESTED] || 0,
    suspended: countsByStatus[REGISTRATION_STATUS.SUSPENDED] || 0,
  };
};

const DATE_FORMAT = '%Y-%m-%d';

export const getAnalyticsTrend = async (days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const [registrationTrend, approvalTrend] = await Promise.all([
    Registration.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: DATE_FORMAT, date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Registration.aggregate([
      {
        $match: {
          registrationStatus: { $in: [REGISTRATION_STATUS.APPROVED, REGISTRATION_STATUS.REJECTED] },
          $or: [{ approvedAt: { $gte: since } }, { rejectedAt: { $gte: since } }],
        },
      },
      {
        $project: {
          status: '$registrationStatus',
          day: {
            $dateToString: {
              format: DATE_FORMAT,
              date: { $ifNull: ['$approvedAt', '$rejectedAt'] },
            },
          },
        },
      },
      { $group: { _id: { day: '$day', status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.day': 1 } },
    ]),
  ]);

  return {
    registrationTrend: registrationTrend.map((entry) => ({ date: entry._id, count: entry.count })),
    approvalTrend: approvalTrend.map((entry) => ({
      date: entry._id.day,
      status: entry._id.status,
      count: entry.count,
    })),
  };
};

export const getGenderDistribution = async () => {
  const results = await PersonalInformation.aggregate([
    { $match: { 'data.gender': { $exists: true, $nin: [null, ''] } } },
    { $group: { _id: '$data.gender', count: { $sum: 1 } } },
  ]);

  return results.map((entry) => ({ gender: entry._id, count: entry.count }));
};

export const getRecentActivity = async (limit = 20) =>
  ActivityLog.find().sort({ createdAt: -1 }).limit(limit);

export default {
  getAnalyticsOverview,
  getAnalyticsTrend,
  getGenderDistribution,
  getRecentActivity,
};
