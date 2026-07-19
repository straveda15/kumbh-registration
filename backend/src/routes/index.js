import { Router } from 'express';
import authRoutes from './auth.routes.js';
import eventRoutes from './event.routes.js';
import qrRoutes from './qr.routes.js';
import registrationRoutes from './registration.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import adminRoutes from './admin.routes.js';
import notificationRoutes from './notification.routes.js';
import documentRoutes from './document.routes.js';
import operatorRoutes from './operator.routes.js';
import pilgrimAuthRoutes from './pilgrimAuth.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', data: {} });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/qr', qrRoutes);
router.use('/registration', registrationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/documents', documentRoutes);
router.use('/operator', operatorRoutes);
router.use('/pilgrim', pilgrimAuthRoutes);

export default router;
