import { Router } from 'express';
import * as registrationController from '../controllers/registration.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { verifyDraftAccess } from '../middlewares/draftAuth.middleware.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import {
  startRegistrationSchema,
  stepDataSchema,
  familyBulkSchema,
  familyMemberSchema,
  familyMemberIdParamSchema,
  registrationIdParamSchema,
  rejectRegistrationSchema,
  requestInfoSchema,
  suspendRegistrationSchema,
  listRegistrationsQuerySchema,
} from '../validators/registration.validator.js';
import {
  setAccountCredentialsSchema,
  changePilgrimPasswordSchema,
} from '../validators/pilgrimAuth.validator.js';

const router = Router();

// Public: the entry point into the wizard or direct pass lookup.
router.post('/start', validate(startRegistrationSchema), registrationController.startRegistration);
router.get('/pass-by-code/:code', registrationController.getPassByCode);

// Session-token protected: the citizen registration wizard + dashboard.
router.get('/draft', verifyDraftAccess, registrationController.getDraft);
router.get('/activity', verifyDraftAccess, registrationController.getActivity);

router.put(
  '/account',
  verifyDraftAccess,
  validate(setAccountCredentialsSchema),
  registrationController.saveAccountCredentials
);
router.put(
  '/account/password',
  verifyDraftAccess,
  validate(changePilgrimPasswordSchema),
  registrationController.changeAccountPassword
);
router.put(
  '/personal',
  verifyDraftAccess,
  validate(stepDataSchema),
  registrationController.savePersonalInformation
);
router.put(
  '/emergency',
  verifyDraftAccess,
  validate(stepDataSchema),
  registrationController.saveEmergencyContact
);
router.put(
  '/medical',
  verifyDraftAccess,
  validate(stepDataSchema),
  registrationController.saveMedicalInformation
);
router.put(
  '/travel',
  verifyDraftAccess,
  validate(stepDataSchema),
  registrationController.saveTravelInformation
);
router.put(
  '/accommodation',
  verifyDraftAccess,
  validate(stepDataSchema),
  registrationController.saveAccommodation
);

// Bulk replace-all for the whole family step.
router.put(
  '/family',
  verifyDraftAccess,
  validate(familyBulkSchema),
  registrationController.saveFamilyMembers
);
router.get('/family', verifyDraftAccess, registrationController.listFamilyMembers);

// Granular single-member operations.
router.post(
  '/family/member',
  verifyDraftAccess,
  validate(familyMemberSchema),
  registrationController.addFamilyMember
);
router.put(
  '/family/member/:id',
  verifyDraftAccess,
  validate({ ...familyMemberIdParamSchema, ...familyMemberSchema }),
  registrationController.updateFamilyMember
);
router.delete(
  '/family/member/:id',
  verifyDraftAccess,
  validate(familyMemberIdParamSchema),
  registrationController.deleteFamilyMember
);

router.post('/submit', verifyDraftAccess, registrationController.submitRegistration);

// Admin: existing protected block, extended with approve/reject.
router.use(protect, restrictTo(ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN));

router.get('/', validate(listRegistrationsQuerySchema), registrationController.listRegistrations);
router.get('/:id', validate(registrationIdParamSchema), registrationController.getRegistration);
router.get(
  '/:id/audit',
  validate(registrationIdParamSchema),
  registrationController.getRegistrationAudit
);
router.get(
  '/:id/documents',
  validate(registrationIdParamSchema),
  registrationController.getRegistrationDocuments
);
router.get(
  '/:id/activity',
  validate(registrationIdParamSchema),
  registrationController.getRegistrationActivityAdmin
);
router.put(
  '/:id/approve',
  validate(registrationIdParamSchema),
  registrationController.approveRegistration
);
router.put(
  '/:id/reject',
  validate(rejectRegistrationSchema),
  registrationController.rejectRegistration
);
router.put(
  '/:id/request-info',
  validate(requestInfoSchema),
  registrationController.requestMoreInfo
);
router.put(
  '/:id/suspend',
  validate(suspendRegistrationSchema),
  registrationController.suspendRegistration
);
router.put(
  '/:id/restore',
  validate(registrationIdParamSchema),
  registrationController.restoreRegistration
);
router.delete(
  '/:id',
  validate(registrationIdParamSchema),
  registrationController.deleteRegistration
);

export default router;
