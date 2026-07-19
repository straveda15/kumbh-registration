import * as dashboardService from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// userId is not available yet since user authentication does not exist.
// This resolves to a shared placeholder dashboard until that lands.
export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getOrCreateDashboard(req.query.userId || null);
  return new ApiResponse(200, { dashboard }, 'Dashboard fetched successfully').send(res);
});

export default { getDashboard };
