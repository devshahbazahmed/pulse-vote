import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { emptyQuestion } from '../lib/pollUtils';
import type {
  AuthedRequest,
  Poll,
  PollQuestion,
  SetView,
  View,
} from '../types';
import AnalyticsView from './AnalyticsView';
import PollDetail from './PollDetail';
import ResponseView from './ResponseView';

type PollWorkspaceProps = {
  authedRequest: AuthedRequest;
  setView: SetView;
  view: View;
};

function PollWorkspace({ authedRequest, setView, view }: PollWorkspaceProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    responseMode: 'anonymous' as Poll['responseMode'],
    expiresAt: '',
    questions: [emptyQuestion()],
  });

  const loadPolls = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authedRequest<Poll[]>('/api/poll');
      setPolls(result);
      setSelectedPollId((current) => current || result[0]?._id || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  }, [authedRequest]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPolls();
  }, [loadPolls]);

  async function handleCreatePoll(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    const questions = pollForm.questions.map((question) => ({
      question: question.question.trim(),
      required: question.required,
      options: question.options
        .map((option) => ({ text: option.text.trim() }))
        .filter((option) => option.text),
    }));

    const invalidQuestion = questions.some(
      (question) => !question.question || question.options.length < 2
    );

    if (invalidQuestion) {
      setError('Each question needs text and at least two options.');
      return;
    }

    try {
      const createdPoll = await authedRequest<Poll>('/api/poll', {
        method: 'POST',
        body: JSON.stringify({
          title: pollForm.title,
          description: pollForm.description,
          questions,
          responseMode: pollForm.responseMode,
          expiresAt: pollForm.expiresAt || undefined,
        }),
      });

      setPolls((current) => [createdPoll, ...current]);
      setSelectedPollId(createdPoll._id);
      setPollForm({
        title: '',
        description: '',
        responseMode: 'anonymous',
        expiresAt: '',
        questions: [emptyQuestion()],
      });
      setNotice('Poll created.');
      setView('polls');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    }
  }

  async function publishPoll(pollId: string) {
    setError('');
    setNotice('');

    try {
      await authedRequest(`/api/poll/${pollId}/publish`, {
        method: 'PATCH',
      });
      setPolls((current) =>
        current.map((poll) =>
          poll._id === pollId ? { ...poll, isPublished: true } : poll
        )
      );
      setNotice('Results published.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish poll');
    }
  }

  function updateQuestion(index: number, patch: Partial<PollQuestion>) {
    setPollForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      ),
    }));
  }

  function updateOption(questionIndex: number, optionIndex: number, text: string) {
    setPollForm((current) => ({
      ...current,
      questions: current.questions.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? { ...option, text } : option
              ),
            }
          : question
      ),
    }));
  }

  function removeQuestion(index: number) {
    setPollForm((current) => ({
      ...current,
      questions:
        current.questions.length === 1
          ? current.questions
          : current.questions.filter((_, questionIndex) => questionIndex !== index),
    }));
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    setPollForm((current) => ({
      ...current,
      questions: current.questions.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? {
              ...question,
              options:
                question.options.length === 2
                  ? question.options
                  : question.options.filter(
                      (_, currentOptionIndex) => currentOptionIndex !== optionIndex
                    ),
            }
          : question
      ),
    }));
  }

  if (view === 'create') {
    return (
      <div className="content-stack">
        <header className="page-header">
          <div>
            <p className="eyebrow">Builder</p>
            <h2>Create a poll</h2>
          </div>
          <button type="button" onClick={() => setView('polls')}>
            View polls
          </button>
        </header>

        <form className="builder" onSubmit={handleCreatePoll}>
          <section className="form-grid">
            <label>
              Title
              <input
                value={pollForm.title}
                onChange={(event) =>
                  setPollForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Response mode
              <select
                value={pollForm.responseMode}
                onChange={(event) =>
                  setPollForm((current) => ({
                    ...current,
                    responseMode: event.target.value as Poll['responseMode'],
                  }))
                }
              >
                <option value="anonymous">Anonymous</option>
                <option value="authenticated">Authenticated</option>
              </select>
            </label>
            <label className="wide">
              Description
              <textarea
                value={pollForm.description}
                onChange={(event) =>
                  setPollForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={3}
              />
            </label>
            <label>
              Expiry
              <input
                type="datetime-local"
                value={pollForm.expiresAt}
                onChange={(event) =>
                  setPollForm((current) => ({
                    ...current,
                    expiresAt: event.target.value,
                  }))
                }
              />
            </label>
          </section>

          <section className="questions">
            {pollForm.questions.map((question, questionIndex) => (
              <div className="question-editor" key={questionIndex}>
                <div className="question-editor-header">
                  <h3>Question {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    Remove
                  </button>
                </div>
                <label>
                  Prompt
                  <input
                    value={question.question}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        question: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        required: event.target.checked,
                      })
                    }
                  />
                  Required
                </label>
                <div className="option-list">
                  {question.options.map((option, optionIndex) => (
                    <div className="option-row" key={optionIndex}>
                      <input
                        aria-label={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(event) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            event.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        required={optionIndex < 2}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(questionIndex, {
                      options: [...question.options, { text: '' }],
                    })
                  }
                >
                  Add option
                </button>
              </div>
            ))}
          </section>

          {error && <p className="message error">{error}</p>}
          {notice && <p className="message success">{notice}</p>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                setPollForm((current) => ({
                  ...current,
                  questions: [...current.questions, emptyQuestion()],
                }))
              }
            >
              Add question
            </button>
            <button className="primary-button" type="submit">
              Create poll
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'respond') {
    return (
      <ResponseView
        authedRequest={authedRequest}
        pollId={selectedPollId}
        setView={setView}
      />
    );
  }

  if (view === 'analytics') {
    return (
      <AnalyticsView
        authedRequest={authedRequest}
        poll={polls.find((poll) => poll._id === selectedPollId) ?? null}
        pollId={selectedPollId}
        setView={setView}
      />
    );
  }

  return (
    <div className="content-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Polls</h2>
        </div>
        <div className="header-actions">
          <button type="button" onClick={loadPolls}>
            Refresh
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setView('create')}
          >
            New poll
          </button>
        </div>
      </header>

      {error && <p className="message error">{error}</p>}
      {notice && <p className="message success">{notice}</p>}

      {loading ? (
        <div className="empty-state">
          <h2>Loading polls</h2>
          <p>Fetching the latest list from the backend.</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="empty-state">
          <h2>No polls yet</h2>
          <p>Create your first poll to start collecting responses.</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => setView('create')}
          >
            Create poll
          </button>
        </div>
      ) : (
        <div className="poll-layout">
          <section className="poll-list" aria-label="Poll list">
            {polls.map((poll) => (
              <button
                className={
                  poll._id === selectedPollId ? 'poll-card active' : 'poll-card'
                }
                key={poll._id}
                type="button"
                onClick={() => setSelectedPollId(poll._id)}
              >
                <span>{poll.title}</span>
                <small>
                  {poll.totalResponses} responses •{' '}
                  {poll.isPublished ? 'Published' : 'Draft'}
                </small>
              </button>
            ))}
          </section>

          <PollDetail
            poll={polls.find((poll) => poll._id === selectedPollId) ?? polls[0]}
            publishPoll={publishPoll}
            setView={setView}
          />
        </div>
      )}
    </div>
  );
}

export default PollWorkspace;
