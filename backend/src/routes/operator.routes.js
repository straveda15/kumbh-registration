import { Router } from 'express';
import * as operatorController from '../controllers/operator.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import { verifyPassSchema, logScanSchema, scanHistoryQuerySchema } from '../validators/operator.validator.js';

const router = Router();

router.use(protect, restrictTo(ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN));

router.post('/verify', validate(verifyPassSchema), operatorController.verifyPass);
router.post('/scan-log', validate(logScanSchema), operatorController.logScan);
router.get('/scan-history', validate(scanHistoryQuerySchema), operatorController.listScanHistory);
router.get('/dashboard', operatorController.getOperatorDashboard);

export default router;
