import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { usePersonalization } from '../context/PersonalizationContext';
import { getRecommendations } from '../services/personalizationApi';

interface HardwareItem {
  name: string;
  description: string;
  price_range: string;
  link: string;
}

interface SoftwareItem {
  name: string;
  description: string;
  free: boolean;
}

interface RecommendationData {
  level: string;
  summary: string;
  hardware: HardwareItem[];
  software: SoftwareItem[];
}

const LEVEL_LABELS: Record<string, string> = {
  non_technical: 'Non-Technical',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  professional: 'Professional',
};

const HardwareRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { level } = usePersonalization();
  const [data, setData] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getRecommendations(user.id)
      .then(setData)
      .catch(() => setError('Could not load recommendations. Check backend connection.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="recommendations-cta">
        <p>
          <a href="/robotics_book/login">Log in</a> to get personalized hardware and software recommendations.
        </p>
      </div>
    );
  }

  if (isLoading) return <p>Loading recommendations...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!data) return null;

  return (
    <div className="recommendations">
      <div className="recommendations__intro">
        <p className="recommendations__summary">{data.summary}</p>
        <p className="recommendations__level-note">
          Showing recommendations for{' '}
          <strong>{LEVEL_LABELS[data.level] ?? data.level}</strong> level.{' '}
          <a href="/robotics_book/questionnaire">Retake questionnaire</a> to update.
        </p>
      </div>

      <section className="recommendations__section">
        <h2>Hardware</h2>
        <div className="recommendations__grid">
          {data.hardware.map((item) => (
            <div key={item.name} className="recommendation-card recommendation-card--hardware">
              <h3 className="recommendation-card__name">{item.name}</h3>
              <p className="recommendation-card__description">{item.description}</p>
              <div className="recommendation-card__footer">
                <span className="recommendation-card__price">{item.price_range}</span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recommendation-card__link button button--sm button--secondary"
                >
                  Learn more
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="recommendations__section">
        <h2>Software & Tools</h2>
        <div className="recommendations__grid">
          {data.software.map((item) => (
            <div key={item.name} className="recommendation-card recommendation-card--software">
              <div className="recommendation-card__header">
                <h3 className="recommendation-card__name">{item.name}</h3>
                {item.free && <span className="recommendation-card__free-badge">Free</span>}
              </div>
              <p className="recommendation-card__description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HardwareRecommendations;
