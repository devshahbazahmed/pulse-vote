import express from 'express';
import { getPollAnalytics } from '../controllers/analytics.controller';

const router = express.Router();

router.get('/:id/analytics', getPollAnalytics);

export default router;
