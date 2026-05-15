import type { Request, Response } from 'express';
import { Poll } from '../models/poll.model.js';
import type { JWTClaims } from '../utils/user-token.js';
import { generateAnalytics } from '../utils/generateAnalytics.js';
import { io } from '../index.js';

type RequestWithUser = Request & { user?: JWTClaims };

async function createPoll(req: RequestWithUser, res: Response) {
  try {
    const { title, description, questions, responseMode, expiresAt } = req.body;

    const poll = await Poll.create({
      title,
      description,
      questions,
      responseMode,
      expiresAt,
      createdBy: req.user?.sub,
    });
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
}

async function getPolls(req: RequestWithUser, res: Response) {
  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .select('-questions.options._id');
    return res.status(200).json(polls);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch polls' });
  }
}

async function getPollById(req: RequestWithUser, res: Response) {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    if (poll.expiresAt && new Date() > poll?.expiresAt) {
      return res.status(400).json({ error: 'Poll has expired' });
    }
    return res.status(200).json(poll);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch poll' });
  }
}

async function publishPoll(req: RequestWithUser, res: Response) {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    if (poll.createdBy?.toString() !== req.user?.sub) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    poll.isPublished = true;
    await poll.save();

    return res.status(200).json({
      message: 'Poll published successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to publish poll' });
  }
}

async function getPublicResults(req: RequestWithUser, res: Response) {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        error: 'Poll not found',
      });
    }

    if (!poll.isPublished) {
      return res.status(403).json({
        message: 'Results not published yet',
      });
    }

    const analytics = await generateAnalytics(poll._id.toString());
    io.to(poll._id.toString()).emit('results_published');
    return res.status(200).json({
      pollTitle: poll.title,
      analytics,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}

export { createPoll, getPolls, getPollById, publishPoll, getPublicResults };
