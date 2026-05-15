import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { AuthMode } from '../types';

type AuthForm = {
  username: string;
  email: string;
  password: string;
};

type AuthScreenProps = {
  authMode: AuthMode;
  authForm: AuthForm;
  error: string;
  notice: string;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  setAuthForm: Dispatch<SetStateAction<AuthForm>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function AuthScreen({
  authMode,
  authForm,
  error,
  notice,
  setAuthMode,
  setAuthForm,
  onSubmit,
}: AuthScreenProps) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Pulse Vote</p>
          <h1>Run focused polls and read the room fast.</h1>
        </div>

        <div className="segmented" aria-label="Authentication mode">
          <button
            className={authMode === 'sign-in' ? 'active' : ''}
            type="button"
            onClick={() => setAuthMode('sign-in')}
          >
            Sign in
          </button>
          <button
            className={authMode === 'sign-up' ? 'active' : ''}
            type="button"
            onClick={() => setAuthMode('sign-up')}
          >
            Sign up
          </button>
        </div>

        <form className="form-stack" onSubmit={onSubmit}>
          {authMode === 'sign-up' && (
            <label>
              Username
              <input
                value={authForm.username}
                onChange={(event) =>
                  setAuthForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
            />
          </label>

          {error && <p className="message error">{error}</p>}
          {notice && <p className="message success">{notice}</p>}

          <button className="primary-button" type="submit">
            {authMode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthScreen;
