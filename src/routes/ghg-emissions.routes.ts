import { createGhgEmissions, getGhgEmissions } from '../controllers/ghg-emissions.controllers';
import { Router } from 'express';
import authenticate from '../middlewares/auth';

//THis is a route Handler for the ghg-emissions route
const router = Router();
router.post('/', createGhgEmissions);
router.get('/',getGhgEmissions)

//Protecting the route with authentication middleware
router.post('/auth/', authenticate, createGhgEmissions);



export default router;