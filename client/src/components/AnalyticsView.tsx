import { useCallback, useEffect, useState } from 'react';
import {
  getOptionLabel,
  getOptionVotes,
  getQuestionLabel,
} from '../lib/pollUtils';
import type { AnalyticsResponse, AuthedRequest, Poll, SetView } from '../types';

type AnalyticsViewProps = {
  authedRequest: AuthedRequest;
  poll: Poll | null;
  pollId: string;
  setView: SetView;
};

function AnalyticsView({
  authedRequest,
  poll,
  pollId,
  setView,
}: AnalyticsViewProps) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    if (!pollId) return;

    setLoading(true);
    setError('');

    try {
      const result = await authedRequest<AnalyticsResponse>(
        `/api/analytics/${pollId}/analytics`
      );
      setAnalytics(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [authedRequest, pollId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics();
  }, [loadAnalytics]);

  const questions = Array.isArray(analytics?.analytics)
    ? analytics.analytics
    : [];

  return (
    <div className="content-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>{analytics?.title ?? poll?.title ?? 'Poll analytics'}</h2>
        </div>
        <div className="header-actions">
          <button type="button" onClick={loadAnalytics}>
            Refresh
          </button>
          <button type="button" onClick={() => setView('polls')}>
            Back to polls
          </button>
        </div>
      </header>

      {error && <p className="message error">{error}</p>}

      {loading ? (
        <div className="empty-state">
          <h2>Loading analytics</h2>
          <p>Counting responses from the backend.</p>
        </div>
      ) : (
        <div className="analytics-grid">
          <section className="metric">
            <span>Total responses</span>
            <strong>{analytics?.totalResponses ?? poll?.totalResponses ?? 0}</strong>
          </section>

          {questions.map((question) => {
            const total =
              question.totalResponses ??
              question.options?.reduce(
                (sum, option) => sum + getOptionVotes(option),
                0
              ) ??
              0;

            return (
              <section className="analytics-card" key={question.questionId}>
                <h3>{getQuestionLabel(question)}</h3>
                <div className="bars">
                  {question.options?.map((option) => {
                    const votes = getOptionVotes(option);
                    const percentage =
                      total > 0 ? Math.round((votes / total) * 100) : 0;

                    return (
                      <div
                        className="bar-row"
                        key={option.optionId ?? getOptionLabel(option)}
                      >
                        <div>
                          <span>{getOptionLabel(option)}</span>
                          <small>
                            {votes} votes • {percentage}%
                          </small>
                        </div>
                        <div className="bar-track">
                          <span style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AnalyticsView;
