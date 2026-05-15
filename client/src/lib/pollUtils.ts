import type { AnalyticsOption, AnalyticsQuestion, PollQuestion } from '../types';

export const emptyQuestion = (): PollQuestion => ({
  question: '',
  required: false,
  options: [{ text: '' }, { text: '' }],
});

export function formatDate(value?: string) {
  if (!value) return 'No expiry';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getQuestionLabel(question: AnalyticsQuestion) {
  return question.question ?? question.questionText ?? 'Question';
}

export function getOptionLabel(option: AnalyticsOption) {
  return option.optionText ?? option.text ?? 'Option';
}

export function getOptionVotes(option: AnalyticsOption) {
  return option.votes ?? option.count ?? 0;
}
