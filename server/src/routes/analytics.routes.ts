import express from 'express';
import { getPollAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/:id/analytics', getPollAnalytics);

export default router;
