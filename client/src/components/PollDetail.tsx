import type { Poll, SetView } from '../types';
import { formatDate } from '../lib/pollUtils';

type PollDetailProps = {
  poll: Poll;
  publishPoll: (pollId: string) => Promise<void>;
  setView: SetView;
};

function PollDetail({ poll, publishPoll, setView }: PollDetailProps) {
  return (
    <article className="detail-panel">
      <div className="detail-header">
        <div>
          <p className="eyebrow">{poll.responseMode}</p>
          <h2>{poll.title}</h2>
          {poll.description && <p>{poll.description}</p>}
        </div>
        <span className={poll.isPublished ? 'status published' : 'status'}>
          {poll.isPublished ? 'Published' : 'Not published'}
        </span>
      </div>

      <dl className="stats-grid">
        <div>
          <dt>Responses</dt>
          <dd>{poll.totalResponses}</dd>
        </div>
        <div>
          <dt>Questions</dt>
          <dd>{poll.questions.length}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{formatDate(poll.expiresAt)}</dd>
        </div>
      </dl>

      <div className="question-preview-list">
        {poll.questions.map((question, index) => (
          <section className="question-preview" key={question._id ?? index}>
            <h3>{question.question}</h3>
            <div>
              {question.options.map((option, optionIndex) => (
                <span key={option._id ?? optionIndex}>{option.text}</span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="detail-actions">
        <button type="button" onClick={() => setView('respond')}>
          Open response form
        </button>
        <button type="button" onClick={() => setView('analytics')}>
          View analytics
        </button>
        <button
          className="primary-button"
          type="button"
          disabled={poll.isPublished}
          onClick={() => publishPoll(poll._id)}
        >
          Publish results
        </button>
      </div>
    </article>
  );
}

export default PollDetail;
