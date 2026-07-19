import { Router } from 'express';
import * as qrController from '../controllers/qr.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import {
  generateQRSchema,
  qrCodeParamSchema,
  qrIdParamSchema,
  updateQRSchema,
  listQRSchema,
  regenerateQRSchema,
} from '../validators/qr.validator.js';

const router = Router();

// Public: scanning a QR code does not require authentication.
router.get('/:code', validate(qrCodeParamSchema), qrController.getQRByCode);

router.use(protect, restrictTo(ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN));

router.get('/', validate(listQRSchema), qrController.listQR);
router.post('/generate', validate(generateQRSchema), qrController.generateQR);
router.post('/regenerate/:eventId', validate(regenerateQRSchema), qrController.regenerateQR);
router.put('/:id', validate(updateQRSchema), qrController.updateQR);
router.delete('/:id', validate(qrIdParamSchema), qrController.deleteQR);

export default router;
