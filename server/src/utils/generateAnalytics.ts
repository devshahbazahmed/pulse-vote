import { Poll } from '../models/poll.model.js';
import { PollResponse } from '../models/response.model.js';

export const generateAnalytics = async (pollId: string) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new Error('Poll not found');
  }

  const responses = await PollResponse.find({ pollId });

  const analytics = [];

  for (const question of poll.questions) {
    // use option id strings as keys to avoid using ObjectId as an index
    const optionCounts: { [key: string]: number } = {};

    for (const option of question.options) {
      optionCounts[option._id.toString()] = 0;
    }

    for (const response of responses) {
      const answer = response.answers.find(
        (a) => a.questionId?.toString() === question._id.toString()
      );

      if (answer && answer.selectedOption) {
        const key = answer.selectedOption.toString();
        if (optionCounts[key] !== undefined) optionCounts[key]++;
      }
    }

    // map counts back to option texts for output
    const options = question.options.map((opt) => ({
      optionId: opt._id,
      text: opt.text,
      count: optionCounts[opt._id.toString()] || 0,
    }));

    analytics.push({
      questionId: question._id,
      question: question.question,
      totalResponses: responses.length,
      options,
    });
  }
  return analytics;
};
