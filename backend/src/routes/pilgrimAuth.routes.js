import { Router } from 'express';
import * as pilgrimAuthController from '../controllers/pilgrimAuth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pilgrimLoginSchema } from '../validators/pilgrimAuth.validator.js';

// Completely separate from /auth (Admin) — its own route file, its own
// service, its own JWT secret (see token.helper.js). A pilgrim account is
// never an Admin/Operator identity and vice versa.
const router = Router();

router.post('/login', validate(pilgrimLoginSchema), pilgrimAuthController.login);

export default router;
