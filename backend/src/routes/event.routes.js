import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';
import { ADMIN_ROLES } from '../constants/roles.js';
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
} from '../validators/event.validator.js';

const router = Router();

router.use(protect, restrictTo(ADMIN_ROLES.ADMIN, ADMIN_ROLES.SUPER_ADMIN));

router.post('/', validate(createEventSchema), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:id', validate(eventIdParamSchema), eventController.getEvent);
router.put('/:id', validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', validate(eventIdParamSchema), eventController.deleteEvent);

export default router;
