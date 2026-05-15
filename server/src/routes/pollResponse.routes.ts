import express from 'express';
import { submitPollResponse } from '../controllers/pollResponse.controller.js';

const router = express.Router();

router.post('/:id/respond', submitPollResponse);

export default router;
