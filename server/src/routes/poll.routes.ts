import express from 'express';
import * as pollController from '../controllers/poll.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticateUser, pollController.createPoll);
router.get('/', authenticateUser, pollController.getPolls);
router.get('/:id', authenticateUser, pollController.getPollById);
router.patch('/:id/publish', authenticateUser, pollController.publishPoll);
router.get('/:id/results', authenticateUser, pollController.getPublicResults);

export default router;
