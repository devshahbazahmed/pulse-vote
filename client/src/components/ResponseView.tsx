import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { request } from '../lib/api';
import type { AuthedRequest, Poll, SetView } from '../types';

type ResponseViewProps = {
  authedRequest: AuthedRequest;
  pollId: string;
  setView: SetView;
};

function ResponseView({ authedRequest, pollId, setView }: ResponseViewProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!pollId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError('');

    authedRequest<Poll>(`/api/poll/${pollId}`)
      .then((result) => {
        setPoll(result);
        setAnswers({});
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load poll')
      )
      .finally(() => setLoading(false));
  }, [authedRequest, pollId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!poll) return;

    const payload = poll.questions
      .filter((question) => question._id && answers[question._id])
      .map((question) => ({
        questionId: question._id,
        selectedOption: answers[question._id as string],
      }));

    try {
      await request(`/api/poll-response/${poll._id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ answers: payload }),
      });
      setNotice('Response submitted.');
      setError('');
      setAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
      setNotice('');
    }
  }

  return (
    <div className="content-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Response</p>
          <h2>{poll?.title ?? 'Poll response'}</h2>
        </div>
        <button type="button" onClick={() => setView('polls')}>
          Back to polls
        </button>
      </header>

      {loading && (
        <div className="empty-state">
          <h2>Loading poll</h2>
          <p>Preparing the response form.</p>
        </div>
      )}

      {error && <p className="message error">{error}</p>}
      {notice && <p className="message success">{notice}</p>}

      {poll && (
        <form className="response-form" onSubmit={handleSubmit}>
          {poll.description && <p className="lead">{poll.description}</p>}
          {poll.questions.map((question) => (
            <fieldset className="response-question" key={question._id}>
              <legend>
                {question.question}
                {question.required && <span> Required</span>}
              </legend>
              {question.options.map((option) => (
                <label className="radio-row" key={option._id}>
                  <input
                    checked={answers[question._id as string] === option._id}
                    name={question._id}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question._id as string]: option._id as string,
                      }))
                    }
                    required={question.required}
                    type="radio"
                    value={option._id}
                  />
                  {option.text}
                </label>
              ))}
            </fieldset>
          ))}
          <button className="primary-button" type="submit">
            Submit response
          </button>
        </form>
      )}
    </div>
  );
}

export default ResponseView;
