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

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  required: {
    type: Boolean,
    defalut: false,
  },
  options: {
    type: [optionSchema],
    validate: [(val: any[]) => val.length >= 2, 'Minimum 2 options'],
  },
});

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    responseMode: {
      type: String,
      enum: ['anonymous', 'authenticated'],
      default: 'anonymous',
    },
    expiresAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalResponses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Poll = mongoose.model('Poll', pollSchema);
