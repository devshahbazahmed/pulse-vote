import express from 'express';
import { submitPollResponse } from '../controllers/pollResponse.controller';

const router = express.Router();

router.post('/:id/respond', submitPollResponse);

export default router;
