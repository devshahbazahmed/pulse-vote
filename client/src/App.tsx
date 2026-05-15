import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import AppShell from './components/AppShell';
import AuthScreen from './components/AuthScreen';
import { request, TOKEN_KEY } from './lib/api';
import type { AuthMode, UserInfo, View } from './types';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in');
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [view, setView] = useState<View>('polls');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const authedRequest = useMemo(
    () =>
      <T,>(path: string, options?: RequestInit) =>
        request<T>(path, options, token),
    [token]
  );

  useEffect(() => {
    if (!token) return;

    authedRequest<UserInfo>('/o/userinfo')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      });
  }, [authedRequest, token]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      if (authMode === 'sign-up') {
        await request('/o/authenticate/sign-up', {
          method: 'POST',
          body: JSON.stringify(authForm),
        });
        setNotice('Account created. Sign in to continue.');
        setAuthMode('sign-in');
        return;
      }

      const result = await request<{ token: string }>(
        '/o/authenticate/sign-in',
        {
          method: 'POST',
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
          }),
        }
      );

      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setView('polls');
  }

  if (!token) {
    return (
      <AuthScreen
        authForm={authForm}
        authMode={authMode}
        error={error}
        notice={notice}
        onSubmit={handleAuth}
        setAuthForm={setAuthForm}
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <AppShell
      authedRequest={authedRequest}
      onSignOut={signOut}
      setView={setView}
      user={user}
      view={view}
    />
  );
}

export default App;
