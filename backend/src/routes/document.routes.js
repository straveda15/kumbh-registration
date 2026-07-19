import { Router } from 'express';
import * as documentController from '../controllers/document.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyDraftAccess } from '../middlewares/draftAuth.middleware.js';
import {
  uploadSignatureSchema,
  createDocumentSchema,
  documentIdParamSchema,
} from '../validators/document.validator.js';

const router = Router();

// Same session token as the wizard/dashboard/notifications — works both
// mid-wizard and post-submission (see draftAuth.middleware.js).
router.post(
  '/signature',
  verifyDraftAccess,
  validate(uploadSignatureSchema),
  documentController.getUploadSignature
);
router.post(
  '/',
  verifyDraftAccess,
  validate(createDocumentSchema),
  documentController.createDocument
);
router.get('/', verifyDraftAccess, documentController.listMyDocuments);
router.delete(
  '/:id',
  verifyDraftAccess,
  validate(documentIdParamSchema),
  documentController.deleteMyDocument
);

export default router;
