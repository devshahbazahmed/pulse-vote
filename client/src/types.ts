import type React from 'react';

export type AuthMode = 'sign-in' | 'sign-up';
export type View = 'polls' | 'create' | 'respond' | 'analytics';

export type AuthedRequest = <T>(
  path: string,
  options?: RequestInit
) => Promise<T>;

export type SetView = React.Dispatch<React.SetStateAction<View>>;

export type UserInfo = {
  sub: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  given_name: string;
  name: string;
};

export type PollOption = {
  _id?: string;
  text: string;
  votes?: number;
};

export type PollQuestion = {
  _id?: string;
  question: string;
  required: boolean;
  options: PollOption[];
};

export type Poll = {
  _id: string;
  title: string;
  description?: string;
  questions: PollQuestion[];
  responseMode: 'anonymous' | 'authenticated';
  expiresAt?: string;
  isPublished: boolean;
  totalResponses: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AnalyticsOption = {
  optionId?: string;
  optionText?: string;
  text?: string;
  votes?: number;
  count?: number;
  percentage?: number;
};

export type AnalyticsQuestion = {
  questionId?: string;
  question?: string;
  questionText?: string;
  totalResponses?: number;
  options?: AnalyticsOption[];
};

export type AnalyticsResponse = {
  pollId?: string;
  pollTitle?: string;
  title?: string;
  totalResponses?: number;
  analytics: AnalyticsQuestion[] | Record<string, unknown>;
};

export type ApiError = {
  error?: string;
  message?: string;
};
