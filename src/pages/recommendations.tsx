import React from 'react';
import Layout from '@theme/Layout';
import HardwareRecommendations from '../components/HardwareRecommendations';

const RecommendationsPage: React.FC = () => {
  return (
    <Layout
      title="Hardware & Software Recommendations"
      description="Personalized hardware and software recommendations based on your expertise level"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <h1>Hardware & Software Recommendations</h1>
            <HardwareRecommendations />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecommendationsPage;
