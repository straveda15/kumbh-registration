import * as adminService from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const overview = await adminService.getAnalyticsOverview();
  return new ApiResponse(200, { overview }, 'Analytics overview fetched successfully').send(res);
});

export const getAnalyticsTrend = asyncHandler(async (req, res) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const trend = await adminService.getAnalyticsTrend(days);
  const genderDistribution = await adminService.getGenderDistribution();
  return new ApiResponse(200, { ...trend, genderDistribution }, 'Trend data fetched successfully').send(
    res
  );
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const activity = await adminService.getRecentActivity(limit);
  return new ApiResponse(200, { activity }, 'Recent activity fetched successfully').send(res);
});

export default { getAnalyticsOverview, getAnalyticsTrend, getRecentActivity };
