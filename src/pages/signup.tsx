import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../components/AuthProvider';

const SignupPage = () => {
  const { user, signUp } = useAuth();
  const [name, setName] = useState('');
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
              <h1>Welcome, {user.name || user.email}</h1>
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

    const { error: signUpError, data } = await signUp.email({
      name,
      email,
      password,
      callbackURL: '/robotics_book/questionnaire',
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/robotics_book/questionnaire';
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--4 col--offset-4">
            <h1>Create Account</h1>

            {error && (
              <div className="alert alert--danger margin-bottom--md" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="margin-bottom--md">
                <label htmlFor="name"><strong>Name</strong></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
                />
              </div>

              <div className="margin-bottom--md">
                <label htmlFor="email"><strong>Email</strong></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
                />
                <small style={{ color: 'var(--ifm-color-emphasis-600)' }}>Minimum 8 characters</small>
              </div>

              <button
                type="submit"
                className="button button--primary button--lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="margin-top--md" style={{ textAlign: 'center' }}>
              Already have an account? <a href="/robotics_book/login">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
