import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import {
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getProfile);
router.put('/me', protect, validate(updateProfileSchema), authController.updateProfile);
router.put('/me/password', protect, validate(changePasswordSchema), authController.changePassword);

export default router;
