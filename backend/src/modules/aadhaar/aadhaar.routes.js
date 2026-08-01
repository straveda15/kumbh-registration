import { Router } from 'express';
import { lookupAadhaar } from './aadhaar.controller.js';

const router = Router();

router.post('/', lookupAadhaar);

export default router;
