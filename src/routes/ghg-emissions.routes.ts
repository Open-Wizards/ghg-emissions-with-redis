import { createGhgEmissions, getGhgEmissions } from '../controllers/ghg-emissions.controllers';
import { Router } from 'express';
import authenticate from '../middlewares/auth';

const router = Router();
router.post('/', createGhgEmissions);
router.post('/auth/',authenticate ,createGhgEmissions);
router.get('/',getGhgEmissions)



export default router;