import type { AuthedRequest, SetView, UserInfo, View } from '../types';
import PollWorkspace from './PollWorkspace';

type AppShellProps = {
  authedRequest: AuthedRequest;
  user: UserInfo | null;
  view: View;
  setView: SetView;
  onSignOut: () => void;
};

function AppShell({
  authedRequest,
  user,
  view,
  setView,
  onSignOut,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Pulse Vote</p>
          <h1>Poll Console</h1>
        </div>
        <nav>
          <button
            className={view === 'polls' ? 'active' : ''}
            type="button"
            onClick={() => setView('polls')}
          >
            Polls
          </button>
          <button
            className={view === 'create' ? 'active' : ''}
            type="button"
            onClick={() => setView('create')}
          >
            Create
          </button>
        </nav>
        <div className="account">
          <span>{user?.username ?? 'Signed in'}</span>
          <small>{user?.email}</small>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <section className="workspace">
        <PollWorkspace
          authedRequest={authedRequest}
          setView={setView}
          view={view}
        />
      </section>
    </main>
  );
}

export default AppShell;
