import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    options: {
      type: [optionSchema],
      validate: [(val: any[]) => val.length >= 2, 'Minimum 2 options'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Poll = mongoose.model('Poll', pollSchema);
