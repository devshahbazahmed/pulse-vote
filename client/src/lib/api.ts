import type { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const TOKEN_KEY = 'pulse_vote_token';

export async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const apiError = data as ApiError | null;
    throw new Error(apiError?.error ?? apiError?.message ?? 'Request failed');
  }

  return data as T;
}
