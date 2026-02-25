import React from 'react';
import Layout from '@theme/Layout';
import LearningPath from '../components/LearningPath';

const LearningPathPage: React.FC = () => {
  return (
    <Layout
      title="Your Learning Path"
      description="A personalized chapter sequence based on your expertise level"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <h1>Your Learning Path</h1>
            <LearningPath />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearningPathPage;
