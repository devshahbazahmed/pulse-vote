import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },

  selectedOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
  },
});

const responseSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export const PollResponse = mongoose.model('PollResponse', responseSchema);
