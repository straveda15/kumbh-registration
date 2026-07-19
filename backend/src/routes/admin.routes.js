import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { ADMIN_ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect, restrictTo(ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN));

router.get('/analytics', adminController.getAnalyticsOverview);
router.get('/analytics/trend', adminController.getAnalyticsTrend);
router.get('/analytics/activity', adminController.getRecentActivity);

export default router;
