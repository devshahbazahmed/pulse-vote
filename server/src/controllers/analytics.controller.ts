import type { Request, Response } from 'express';
import type { JWTClaims } from '../utils/user-token.js';
import { Poll } from '../models/poll.model.js';
import { PollResponse } from '../models/response.model.js';
import { generateAnalytics } from '../utils/generateAnalytics.js';

type RequestWithUser = Request & { user?: JWTClaims };

async function getPollAnalytics(req: RequestWithUser, res: Response) {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        error: 'Poll not found',
      });
    }

    const responses = await PollResponse.find({
      pollId: poll._id,
    });

    const analytics = await generateAnalytics(poll._id.toString());

    return res.json({
      pollId: poll._id,
      title: poll.title,
      totalResponses: responses.length,
      analytics,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: 'Failed to fetch analytics',
    });
  }
}

export { getPollAnalytics };
