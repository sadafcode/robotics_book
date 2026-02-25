import React from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../components/AuthProvider';
import BackgroundQuestionnaire from '../components/BackgroundQuestionnaire';

const QuestionnairePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="container margin-vert--lg" style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Sign In Required">
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--6 col--offset-3" style={{ textAlign: 'center' }}>
              <h1>Sign In Required</h1>
              <p>Please sign in to set up your personalized learning profile.</p>
              <a className="button button--primary" href="/robotics_book/login">Log In</a>
              <span style={{ margin: '0 12px' }}>or</span>
              <a className="button button--secondary" href="/robotics_book/signup">Sign Up</a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Learning Profile Setup"
      description="Answer a few questions to personalize your Physical AI learning experience"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1>Set Up Your Learning Profile</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Answer 7 quick questions so we can tailor this book to your background.
              </p>
            </div>
            <BackgroundQuestionnaire />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionnairePage;
