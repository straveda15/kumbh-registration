import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected via admin auth for now; will move to user auth once it exists.
router.get('/', protect, dashboardController.getDashboard);

export default router;
