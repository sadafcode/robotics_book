import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../components/AuthProvider';
import { saveAuthToken } from '../auth/client';

const LoginPage = () => {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <Layout title="Already Signed In">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3" style={{ textAlign: 'center' }}>
              <h1>Welcome back, {user.name || user.email}</h1>
              <p>You are already signed in.</p>
              <a className="button button--primary" href="/robotics_book/">Go to Home</a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError, data } = await signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    } else {
      if (data?.token) saveAuthToken(data.token);
      window.location.href = '/robotics_book/';
    }
  };

  return (
    <Layout title="Login">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--4 col--offset-4">
            <h1>Login</h1>

            {error && (
              <div className="alert alert--danger margin-bottom--md" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="margin-bottom--md">
                <label htmlFor="email"><strong>Email</strong></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
                />
              </div>

              <div className="margin-bottom--md">
                <label htmlFor="password"><strong>Password</strong></label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
                />
              </div>

              <button
                type="submit"
                className="button button--primary button--lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="margin-top--md" style={{ textAlign: 'center' }}>
              Don't have an account? <a href="/robotics_book/signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
