import type { Request, Response } from 'express';
import type { JWTClaims } from '../utils/user-token';
import { Poll } from '../models/poll.model';
import { PollResponse } from '../models/response.model';
import { generateAnalytics } from '../utils/generateAnalytics';
import { io } from '..';

type RequestWithUser = Request & { user?: JWTClaims };

async function submitPollResponse(req: RequestWithUser, res: Response) {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        error: 'Poll not found',
      });
    }

    if (poll.expiresAt && new Date() > poll.expiresAt) {
      return res.status(400).json({ error: 'Poll has expired' });
    }

    const { answers } = req.body;

    for (const question of poll.questions) {
      if (question.required) {
        const answered = answers.find(
          (a: { questionId: string }) =>
            a.questionId === question._id.toString()
        );

        if (!answered) {
          return res.status(400).json({
            error: `${question.question} is required`,
          });
        }
      }
    }

    const response = await PollResponse.create({
      pollId: poll._id,
      answers,
    });

    poll.totalResponses += 1;
    await poll.save();

    const analytics = await generateAnalytics(poll._id.toString());

    io.to(poll._id.toString()).emit('poll_updated', analytics);

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export { submitPollResponse };
